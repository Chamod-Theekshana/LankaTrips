export const packages = (locationIdsByName) => ([
  {
    title: 'Classic Cultural Triangle (3 Days)',
    price: 45000,
    durationDays: 3,
    category: 'Culture',
    region: 'Central',
    locationRefs: [
      locationIdsByName['Sigiriya Rock Fortress'],
      locationIdsByName['Kandy']
    ],
    itinerary: [
      'Day 1: Arrive in Kandy, Temple of the Tooth, evening cultural show.',
      'Day 2: Travel to Sigiriya, climb the rock, village experience.',
      'Day 3: Optional Dambulla cave temple, return to Colombo.'
    ],
    includes: ['Hotel accommodation', 'Breakfast', 'Private transport', 'Driver/guide'],
    excludes: ['Entrance tickets', 'Lunch & dinner', 'Personal expenses'],
    images: ['/uploads/demo_pkg_culture.png']
  },
  {
    title: 'Hill Country Escape (2 Days)',
    price: 38000,
    durationDays: 2,
    category: 'Nature',
    region: 'Uva',
    locationRefs: [
      locationIdsByName['Ella']
    ],
    itinerary: [
      'Day 1: Scenic train ride (optional), Nine Arches Bridge, Little Adam\'s Peak.',
      'Day 2: Tea factory visit, waterfalls, return.'
    ],
    includes: ['Accommodation', 'Breakfast', 'Transport'],
    excludes: ['Train tickets', 'Lunch & dinner'],
    images: ['/uploads/demo_pkg_hills.png']
  },
  {
    title: 'South Coast Beach + Fort (2 Days)',
    price: 42000,
    durationDays: 2,
    category: 'Beach',
    region: 'Southern',
    locationRefs: [
      locationIdsByName['Galle Fort'],
      locationIdsByName['Mirissa']
    ],
    itinerary: [
      'Day 1: Galle Fort walking tour, sunset by the ramparts.',
      'Day 2: Mirissa beach + optional whale watching tour.'
    ],
    includes: ['Accommodation', 'Breakfast', 'Transport'],
    excludes: ['Whale watching tickets', 'Lunch & dinner'],
    images: ['/uploads/demo_pkg_beach.png']
  },
  {
    title: 'Yala Wildlife Safari (1 Day)',
    price: 30000,
    durationDays: 1,
    category: 'Adventure',
    region: 'Southern',
    locationRefs: [
      locationIdsByName['Yala National Park']
    ],
    itinerary: [
      'Morning pickup, safari jeep experience, return by evening.'
    ],
    includes: ['Safari jeep', 'Park permit assistance', 'Transport'],
    excludes: ['Park entrance tickets', 'Meals'],
    images: ['/uploads/demo_pkg_safari.png']
  }
]);
