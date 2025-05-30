export type RightClickCallback = (event: MouseEvent) => void;

export class RightClickHandler {
  private callback: RightClickCallback;
  private targetElement: HTMLElement | Window;
  private boundHandleContextMenu: (event: Event) => void; 
  private isListening: boolean = false;

  constructor(callback: RightClickCallback, targetElement: HTMLElement | Window = window) {
    this.callback = callback;
    this.targetElement = targetElement;
    this.boundHandleContextMenu = this.handleContextMenu.bind(this);
  }

  private handleContextMenu(event: Event): void {
    event.preventDefault();
    this.callback(event as MouseEvent);
  }

  public start(): void {
    if (this.isListening) {
      return;
    }
    this.targetElement.addEventListener('contextmenu', this.boundHandleContextMenu);
    this.isListening = true;
  }

  public stop(): void {
    if (!this.isListening) {
      return;
    }
    this.targetElement.removeEventListener('contextmenu', this.boundHandleContextMenu);
    this.isListening = false;
  }
}