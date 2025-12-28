/**
 * Applies:
 * - search via q (regex) on provided fields
 * - filter via allowedFilters map
 * - pagination via page, limit
 * - sort via sort (comma separated), default -createdAt
 */
export function buildQuery({ modelQuery, query, searchFields = [], allowedFilters = {} }) {
  const q = query.q?.trim();
  if (q && searchFields.length) {
    modelQuery = modelQuery.find({
      $or: searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }))
    });
  }

  // filters
  for (const [key, type] of Object.entries(allowedFilters)) {
    const val = query[key];
    if (val === undefined || val === '') continue;

    if (type === 'number') modelQuery = modelQuery.find({ [key]: Number(val) });
    if (type === 'string') modelQuery = modelQuery.find({ [key]: val });
    if (type === 'array') modelQuery = modelQuery.find({ [key]: { $in: String(val).split(',') } });
  }

  // sort
  const sort = query.sort ? query.sort.split(',').join(' ') : '-createdAt';
  modelQuery = modelQuery.sort(sort);

  // paginate
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 12)));
  const skip = (page - 1) * limit;
  modelQuery = modelQuery.skip(skip).limit(limit);

  return { modelQuery, page, limit };
}
