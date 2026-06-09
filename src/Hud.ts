import { HUD } from './constants/hud'

export class Hud {
  private instructions: HTMLElement
  private hudText: HTMLElement
  private interactionPrompt: HTMLElement

  constructor() {
    this.instructions = this.createDiv(HUD.instructionsStyle, HUD.instructionsText)
    this.hudText = this.createDiv(HUD.infoStyle, HUD.infoText)
    this.interactionPrompt = this.createDiv(HUD.interactionStyle)
  }

  private createDiv(cssText: string, textContent?: string): HTMLElement {
    const el = document.createElement('div')
    el.style.cssText = cssText
    if (textContent) el.textContent = textContent
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
