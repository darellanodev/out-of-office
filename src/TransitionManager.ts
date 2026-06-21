import { DOOR } from './constants'

const overlay = document.createElement('div')
overlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: black;
  opacity: 0;
  transition: opacity ${DOOR.fadeDuration}s;
  pointer-events: none;
  z-index: 999;
`
document.body.appendChild(overlay)

function animateOpacity(opacity: string): Promise<void> {
  return new Promise((resolve) => {
    overlay.style.opacity = opacity
    overlay.addEventListener('transitionend', () => resolve(), { once: true })
    setTimeout(resolve, DOOR.fadeDuration * 1000)
  })
}

export function fadeOut(): Promise<void> {
  return animateOpacity('1')
}

export function fadeIn(): Promise<void> {
  return animateOpacity('0')
}
