import Location from '../models/Location.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildQuery } from '../utils/queryFeatures.js';

function toArrayFromComma(input) {
  if (!input) return [];
  return String(input)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

export const listLocations = asyncHandler(async (req, res) => {
  let q = Location.find();
  const { modelQuery, page, limit } = buildQuery({
    modelQuery: q,
    query: req.query,
    searchFields: ['name', 'region', 'description', 'tags'],
    allowedFilters: { region: 'string' }
  });

  const [items, total] = await Promise.all([
    modelQuery.exec(),
    Location.countDocuments().exec()
  ]);

  return ok(res, items, 'Locations', { page, limit, total });
});

export const getLocation = asyncHandler(async (req, res) => {
  const item = await Location.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Location not found');
  }
  return ok(res, item, 'Location');
});

export const createLocation = asyncHandler(async (req, res) => {
  const { name, region, description, mapUrl, tags, images } = req.body;

  const doc = await Location.create({
    name,
    region,
    description,
    mapUrl: mapUrl || undefined,
    tags: toArrayFromComma(tags),
    images: images || []
  });

  return ok(res, doc, 'Location created');
});

export const updateLocation = asyncHandler(async (req, res) => {
  const existing = await Location.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error('Location not found');
  }

  const { name, region, description, mapUrl, tags } = req.validated.body;
  const newImages = (req.files || []).map(f => f.path);

  existing.name = name ?? existing.name;
  existing.region = region ?? existing.region;
  existing.description = description ?? existing.description;
  existing.mapUrl = mapUrl || existing.mapUrl;
  if (tags !== undefined) existing.tags = toArrayFromComma(tags);
  if (newImages.length) existing.images = [...existing.images, ...newImages];

  await existing.save();
  return ok(res, existing, 'Location updated');
});

export const deleteLocation = asyncHandler(async (req, res) => {
  const deleted = await Location.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error('Location not found');
  }
  return ok(res, deleted, 'Location deleted');
});
