// World layout constants shared by terrain, buildings, vegetation and wildlife.
export const WATER_LEVEL = -0.45;
export const FLOOR = 0.6;             // cabin floor top
export const WORLD_RADIUS = 175;      // walkable radius
export const TERRAIN_SIZE = 640;

export const REGION = { id: 'pines', name: 'Pine Lake' };
export const LAKE = { x: 6, z: 58, rx: 48, rz: 34, depth: 7 };
export const CABIN = { x: 0, z: 0 };
export const TREEHOUSE = { x: -46, z: -38 };
export const CLEARING = { x: 44, z: -36 };
export const DOCK = { x: 6, zStart: 24.5, zEnd: 38, width: 2.2 };

// Trails as polylines [x, z]
export const PATHS = [
  [[-2, 7.2], [-1, 11], [2, 16], [5, 20], [6, 24.5]],                         // porch -> dock
  [[-6.5, 2], [-11, -2], [-17, -9], [-25, -17], [-33, -26], [-41, -33], [-44, -36]], // cabin -> treehouse
  [[2, 16], [-10, 22], [-22, 30], [-34, 44], [-40, 58], [-36, 76], [-22, 92], [-2, 98]],  // west lake loop
  [[6, -4], [14, -10], [24, -20], [34, -29], [42, -34]],                      // cabin -> clearing
  [[42, -34], [52, -16], [60, 6], [62, 30], [58, 52], [48, 74], [30, 92], [10, 98], [-2, 98]],  // east loop
];

export const PLACES = [
  { id: 'living', name: 'Living room', pos: [-1.0, 0, 1.6], yaw: Math.PI * 0.55 },
  { id: 'bedroom', name: 'Bedroom', pos: [2.6, 0, 0.6], yaw: -Math.PI * 0.6 },
  { id: 'porch', name: 'Porch', pos: [-0.5, 0, 4.9], yaw: Math.PI },
  { id: 'dock', name: 'Dock', pos: [6, 0, 30], yaw: Math.PI },
  { id: 'treehouse', name: 'Tree house', pos: [TREEHOUSE.x + 1.6, 0, TREEHOUSE.z - 1.1], yaw: Math.atan2(-(6 - TREEHOUSE.x - 1.6), -(58 - TREEHOUSE.z + 1.1)) },
  { id: 'clearing', name: 'Forest clearing', pos: [CLEARING.x - 3.2, 0, CLEARING.z + 4.2], yaw: Math.atan2(-3.2, 4.2) },
  { id: 'lakeshore', name: 'Far lakeshore', pos: [-20, 0, 95], yaw: 0.2 },
];

export const REGIONS = {
  pines: { name: 'Pine Lake', blurb: 'A log cabin in a rainy pine forest by a quiet lake.' },
  hollow: { name: 'Maple Hollow', blurb: 'An autumn valley: a tea house, a hot spring, koi and a bamboo grove.' },
};

const PINES = {
  LAKE: { ...LAKE }, CABIN: { ...CABIN }, TREEHOUSE: { ...TREEHOUSE }, CLEARING: { ...CLEARING }, DOCK: { ...DOCK },
  PATHS: PATHS.map((p) => p.map((q) => [...q])), PLACES: PLACES.map((p) => ({ ...p })),
};

const HOLLOW = {
  LAKE: { x: 12, z: 34, rx: 15, rz: 9.5, depth: 2.4 },
  CABIN: { x: 0, z: 0 },
  TREEHOUSE: { x: 36, z: -30 },       // moon-viewing deck on the hill
  CLEARING: { x: -34, z: 14 },        // hot spring
  DOCK: { x: 12, zStart: 23.5, zEnd: 44.5, width: 1.8 }, // the koi bridge
  PATHS: [
    [[0, 6.6], [2, 11], [7, 16], [11, 20], [12, 23.5]],                            // tea house -> koi bridge
    [[12, 44.5], [10, 52], [0, 58], [-14, 56], [-24, 46], [-30, 30], [-33, 18]],   // around the pond to the spring
    [[-6.8, 0], [-14, 3], [-22, 7], [-30, 12]],                                     // tea house -> hot spring
    [[6.8, -1], [14, -8], [22, -16], [30, -24], [35, -28]],                         // tea house -> moon deck
    [[-6, -5], [-12, -12], [-20, -20], [-27, -27], [-34, -30]],                     // bamboo grove walk
  ],
  PLACES: [
    { id: 'tearoom', name: 'Tea room', pos: [-1.5, 0, 1.2], yaw: Math.PI * 0.75 },
    { id: 'veranda', name: 'Veranda', pos: [0.5, 0, 3.8], yaw: Math.PI },
    { id: 'spring', name: 'Hot spring', pos: [-30.5, 0, 16.5], yaw: Math.atan2(3.5, -2.5) },
    { id: 'bridge', name: 'Koi bridge', pos: [12, 0, 31], yaw: Math.PI / 2 },
    { id: 'bamboo', name: 'Bamboo grove', pos: [-22, 0, -22], yaw: Math.PI * 0.8 },
    { id: 'moondeck', name: 'Moon-viewing deck', pos: [35, 0, -28], yaw: Math.PI * 0.85 },
    { id: 'swing', name: 'Maple swing', pos: [12, 0, -7], yaw: Math.PI * 0.3 },
  ],
};

/** Switch the shared layout to a region before the world is built. */
export function applyRegion(id) {
  const R = id === 'hollow' ? HOLLOW : PINES;
  REGION.id = id === 'hollow' ? 'hollow' : 'pines'; REGION.name = REGIONS[REGION.id].name;
  Object.assign(LAKE, R.LAKE); Object.assign(CABIN, R.CABIN); Object.assign(TREEHOUSE, R.TREEHOUSE); Object.assign(CLEARING, R.CLEARING); Object.assign(DOCK, R.DOCK);
  PATHS.length = 0; R.PATHS.forEach((p) => PATHS.push(p));
  PLACES.length = 0; R.PLACES.forEach((p) => PLACES.push(p));
}
