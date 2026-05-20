export class HUD {
  private instructions: HTMLElement;
  private hudText: HTMLElement;

  constructor() {
    this.instructions = this.createInstructions();
    this.hudText = this.createHudText();
  }

  private createInstructions(): HTMLElement {
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#aaa;font-family:sans-serif;font-size:16px;pointer-events:none;";
    el.textContent = "Click to play";
    document.body.appendChild(el);
    return el;
  }

  private createHudText(): HTMLElement {
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-120%);color:#ccc;font-family:sans-serif;font-size:14px;text-align:center;pointer-events:none;max-width:500px;line-height:1.5;background:rgba(0,0,0,0.65);border-radius:12px;padding:16px 20px;";
    el.textContent =
      "Move with W, A, S, D keys and walk around to memorize the objects. In the next round you must find the changes.";
    document.body.appendChild(el);
    return el;
  }

  update(isLocked: boolean, distanceTraveled: number, threshold: number): void {
    this.instructions.style.display = isLocked ? "none" : "block";
    this.hudText.style.display =
      isLocked && distanceTraveled < threshold ? "block" : "none";
  }
}
