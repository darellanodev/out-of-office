export const CONFIG = {
  camera: {
    fov: 75,
    near: 0.05,
    far: 100,
    position: { x: 0, y: 3.3, z: 3 },
  },
  shadows: {
    mapSize: 256,
    bias: -0.005,
    normalBias: 0.02,
  },
  player: {
    speed: 3,
    collisionMargin: 0.2,
    distanceThreshold: 10,
  },
} as const;
