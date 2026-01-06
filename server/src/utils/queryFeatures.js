export function buildQuery({ modelQuery, query, searchFields = [], allowedFilters = {} }) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
  const skip = (page - 1) * limit;

  // Search functionality
  if (query.q && searchFields.length > 0) {
    const searchRegex = { $regex: query.q, $options: 'i' };
    const searchConditions = searchFields.map(field => ({ [field]: searchRegex }));
    modelQuery = modelQuery.find({ $or: searchConditions });
  }

  // Apply filters
  Object.keys(allowedFilters).forEach(filterKey => {
    if (query[filterKey]) {
      const filterType = allowedFilters[filterKey];
      if (filterType === 'string') {
        modelQuery = modelQuery.find({ [filterKey]: query[filterKey] });
      }
    }
  });

  // Pagination
  modelQuery = modelQuery.skip(skip).limit(limit);

  // Sorting
  if (query.sort) {
    const sortFields = query.sort.split(',').join(' ');
    modelQuery = modelQuery.sort(sortFields);
  } else {
    modelQuery = modelQuery.sort('-createdAt');
  }

  return { modelQuery, page, limit };
}