import { HUD } from './constants/hud'

export class Hud {
  private instructions: HTMLElement
  private hudText: HTMLElement

  constructor() {
    this.instructions = this.createInstructions()
    this.hudText = this.createHudText()
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

  update(isLocked: boolean, distanceTraveled: number, threshold: number): void {
    this.instructions.style.display = isLocked ? 'none' : 'block'
    this.hudText.style.display =
      isLocked && distanceTraveled < threshold ? 'block' : 'none'
  }
}
