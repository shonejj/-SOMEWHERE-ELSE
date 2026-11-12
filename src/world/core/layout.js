// World layout constants shared by terrain, buildings, vegetation and wildlife.
export const WATER_LEVEL = -0.45;
export const FLOOR = 0.6;             // cabin floor top
export const WORLD_RADIUS = 175;      // walkable radius
export const TERRAIN_SIZE = 640;

export const LAKE = { x: 6, z: 58, rx: 48, rz: 34 };
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
  { id: 'clearing', name: 'Forest clearing', pos: [CLEARING.x - 3, 0, CLEARING.z + 4], yaw: 0.6 },
  { id: 'lakeshore', name: 'Far lakeshore', pos: [-20, 0, 95], yaw: 0.2 },
];
