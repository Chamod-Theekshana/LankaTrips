import Package from '../models/Package.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

function splitLines(input) {
  if (!input) return [];
  return String(input).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}

function toArrayFromComma(input) {
  if (!input) return [];
  return String(input).split(',').map(s => s.trim()).filter(Boolean);
}

export const listPackages = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 12)));
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.region) filters.region = req.query.region;

  // price range
  if (req.query.priceMin || req.query.priceMax) {
    filters.price = {};
    if (req.query.priceMin) filters.price.$gte = Number(req.query.priceMin);
    if (req.query.priceMax) filters.price.$lte = Number(req.query.priceMax);
  }
  // duration range
  if (req.query.durationMin || req.query.durationMax) {
    filters.durationDays = {};
    if (req.query.durationMin) filters.durationDays.$gte = Number(req.query.durationMin);
    if (req.query.durationMax) filters.durationDays.$lte = Number(req.query.durationMax);
  }

  const q = req.query.q?.trim();
  const search = q ? { $or: [{ title: { $regex: q, $options: 'i' } }, { category: { $regex: q, $options: 'i' } }, { region: { $regex: q, $options: 'i' } }] } : {};

  const [items, total] = await Promise.all([
    Package.find({ ...filters, ...search })
      .populate('locationRefs', 'name region')
      .sort(req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt')
      .skip(skip)
      .limit(limit)
      .exec(),
    Package.countDocuments({ ...filters, ...search }).exec()
  ]);

  return ok(res, items, 'Packages', { page, limit, total });
});

export const getPackage = asyncHandler(async (req, res) => {
  const item = await Package.findById(req.params.id).populate('locationRefs');
  if (!item) {
    res.status(404);
    throw new Error('Package not found');
  }
  return ok(res, item, 'Package');
});

export const createPackage = asyncHandler(async (req, res) => {
  const { title, price, durationDays, category, region, locationRefs, itinerary, includes, excludes, images } = req.body;

  const doc = await Package.create({
    title,
    price,
    durationDays,
    category,
    region,
    locationRefs: toArrayFromComma(locationRefs),
    itinerary: splitLines(itinerary),
    includes: splitLines(includes),
    excludes: splitLines(excludes),
    images: images || []
  });

  return ok(res, doc, 'Package created');
});

export const updatePackage = asyncHandler(async (req, res) => {
  const existing = await Package.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error('Package not found');
  }

  const { title, price, durationDays, category, region, locationRefs, itinerary, includes, excludes } = req.validated.body;
  const newImages = (req.files || []).map(f => f.path);

  if (title !== undefined) existing.title = title;
  if (price !== undefined) existing.price = Number(price);
  if (durationDays !== undefined) existing.durationDays = Number(durationDays);
  if (category !== undefined) existing.category = category;
  if (region !== undefined) existing.region = region;

  if (locationRefs !== undefined) existing.locationRefs = toArrayFromComma(locationRefs);
  if (itinerary !== undefined) existing.itinerary = splitLines(itinerary);
  if (includes !== undefined) existing.includes = splitLines(includes);
  if (excludes !== undefined) existing.excludes = splitLines(excludes);

  if (newImages.length) existing.images = [...existing.images, ...newImages];

  await existing.save();
  return ok(res, existing, 'Package updated');
});

export const deletePackage = asyncHandler(async (req, res) => {
  const deleted = await Package.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error('Package not found');
  }
  return ok(res, deleted, 'Package deleted');
});
