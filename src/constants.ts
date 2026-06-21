export const CAMERA = {
  fov: 75,
  near: 0.05,
  far: 100,
  position: { x: 0, y: 3.3, z: 3 },
} as const

export const PLAYER = {
  speed: 3,
  collisionMargin: 0.2,
  distanceThreshold: 10,
}

export const SCENE = {
  background: 0x111111,
} as const

export const DOOR = {
  interactionDistance: 3,
  fadeDuration: 0.5,
}

export const ASSETS = {
  music: 'music.mp3',
  scene: 'scene1.glb',
} as const

export const LIGHTS = {
  ambientColor: 0xffffff,
  ambientIntensity: 0.15,
} as const

export const HUD = {
  instructionsStyle:
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#aaa;font-family:sans-serif;font-size:16px;pointer-events:none;',
  instructionsText: 'Click to play',
  infoStyle:
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-120%);color:#ccc;font-family:sans-serif;font-size:14px;text-align:center;pointer-events:none;max-width:500px;line-height:1.5;background:rgba(0,0,0,0.65);border-radius:12px;padding:16px 20px;',
  infoText:
    'Move with W, A, S, D keys and walk around to memorize the objects. In the next round you must find the changes.',
  interactionStyle:
    'position:fixed;bottom:15%;left:50%;transform:translateX(-50%);color:white;font-family:monospace;font-size:18px;text-shadow:0 0 10px rgba(0,0,0,0.8);pointer-events:none;display:none;z-index:100;',
} as const

export const MUSIC = {
  loop: true,
  volume: 0.1,
} as const

export const SHADOWS = {
  mapSize: 256,
  bias: -0.005,
  normalBias: 0.02,
}
