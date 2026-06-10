import { DOOR } from './constants/door'

export class TransitionManager {
  private overlay: HTMLDivElement

  constructor() {
    this.overlay = document.createElement('div')
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: black;
      opacity: 0;
      transition: opacity ${DOOR.fadeDuration}s;
      pointer-events: none;
      z-index: 999;
    `
    document.body.appendChild(this.overlay)
  }

  private animateOpacity(opacity: string): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.style.opacity = opacity
      this.overlay.addEventListener('transitionend', () => resolve(), {
        once: true,
      })
      setTimeout(resolve, DOOR.fadeDuration * 1000)
    })
  }

  fadeOut(): Promise<void> {
    return this.animateOpacity('1')
  }

  fadeIn(): Promise<void> {
    return this.animateOpacity('0')
  }
}
