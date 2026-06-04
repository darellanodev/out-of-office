import { HUD } from './constants/hud'

export class Hud {
  private instructions: HTMLElement
  private hudText: HTMLElement
  private interactionPrompt: HTMLElement

  constructor() {
    this.instructions = this.createInstructions()
    this.hudText = this.createHudText()
    this.interactionPrompt = this.createInteractionPrompt()
  }

  private createInstructions(): HTMLElement {
    const el = document.createElement('div')
    el.style.cssText = HUD.instructionsStyle
    el.textContent = HUD.instructionsText
    document.body.appendChild(el)
    return el
  }

  private createHudText(): HTMLElement {
    const el = document.createElement('div')
    el.style.cssText = HUD.infoStyle
    el.textContent = HUD.infoText
    document.body.appendChild(el)
    return el
  }

  private createInteractionPrompt(): HTMLElement {
    const el = document.createElement('div')
    el.style.cssText = `
      position: fixed;
      bottom: 15%;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: monospace;
      font-size: 18px;
      text-shadow: 0 0 10px rgba(0,0,0,0.8);
      pointer-events: none;
      display: none;
      z-index: 100;
    `
    document.body.appendChild(el)
    return el
  }

  showInteraction(text: string) {
    this.interactionPrompt.textContent = text
    this.interactionPrompt.style.display = 'block'
  }

  hideInteraction() {
    this.interactionPrompt.style.display = 'none'
  }

  update(isLocked: boolean, distanceTraveled: number, threshold: number): void {
    this.instructions.style.display = isLocked ? 'none' : 'block'
    this.hudText.style.display =
      isLocked && distanceTraveled < threshold ? 'block' : 'none'
  }
}
