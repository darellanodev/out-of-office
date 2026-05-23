export const HUD = {
  instructionsStyle:
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#aaa;font-family:sans-serif;font-size:16px;pointer-events:none;',
  instructionsText: 'Click to play',
  infoStyle:
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-120%);color:#ccc;font-family:sans-serif;font-size:14px;text-align:center;pointer-events:none;max-width:500px;line-height:1.5;background:rgba(0,0,0,0.65);border-radius:12px;padding:16px 20px;',
  infoText:
    'Move with W, A, S, D keys and walk around to memorize the objects. In the next round you must find the changes.',
} as const
