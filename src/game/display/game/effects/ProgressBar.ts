import { Pos } from "../../../../utils/Math";
import Container = Phaser.GameObjects.Container;
import Graphics = Phaser.GameObjects.Graphics;

export type Position = "top" | "bottom" | "left" | "right";
export type Direction = "horizontal" | "vertical";

export interface ValueRef {
  current: number;
  max: number;
}

export interface SizeConfig {
  minWidth: number;
  maxWidth: number;
  minWidthValue: number;
  maxWidthValue: number;
}

export interface BorderConfig {
  color: number;
  thickness: number;
  radius?: number;
  opacity?: number;
}

export interface ProgressBarConfig {
  position: Position;
  offset: number;
  valueRef: ValueRef;
  size: SizeConfig;
  fillColor?: number;
  backgroundColor?: number;
  direction?: Direction;
  border?: BorderConfig;
}

export class ProgressBar {
  private container: Container;
  private graphics: Graphics;
  private config: Required<Omit<ProgressBarConfig, 'border'>> & { border?: BorderConfig };

  private isVisible: boolean = true;
  private anchorPos = { x: 0, y: 0 };
  private displayWidth: number = 32;
  private displayHeight: number = 32;

  private lastValue: number = -1;
  private lastMax: number = -1;
  private lastVisible: boolean = true;

  constructor(container: Container, config: ProgressBarConfig) {
    this.container = container;
    const direction: Direction =
      config.direction ?? (config.position === "left" || config.position === "right" ? "vertical" : "horizontal");

    this.config = {
      direction,
      fillColor: 0x00ff00,
      backgroundColor: 0x000000,
      ...config
    };

    this.graphics = container.scene.add.graphics();
    this.container.add(this.graphics);
    
    const sprite = container.list.find(obj => obj instanceof Phaser.GameObjects.Sprite) as Phaser.GameObjects.Sprite;
    if (sprite) {
      this.displayWidth = sprite.displayWidth;
      this.displayHeight = sprite.displayHeight;
    }
  }

  destroy(): void {
    this.graphics.destroy();
  }

  hide(): void {
    this.isVisible = false;
    this.graphics.setVisible(false);
  }

  show(): void {
    this.isVisible = true;
    this.graphics.setVisible(true);
  }

  update(delta: number, position:Pos): void {
    if (!this.isVisible || !this.config.valueRef) return;

    const { current, max } = this.config.valueRef;
    if (current === this.lastValue && max === this.lastMax && this.isVisible === this.lastVisible) return;

    this.lastValue = current;
    this.lastMax = max;
    this.lastVisible = this.isVisible;

    const { minWidth, maxWidth, minWidthValue, maxWidthValue } = this.config.size;
    const { fillColor, backgroundColor, direction, border } = this.config;

    const thickness = 6;
    const barLength = this.calculateWidth(max, minWidthValue, maxWidthValue, minWidth, maxWidth);
    const progress = Phaser.Math.Clamp(current / (max || 1), 0, 1);

    this.updateDisplaySize();
    this.getAnchorPosition(barLength, thickness);
    this.anchorPos.x += position.x;
    this.anchorPos.y += position.y;
    
    this.graphics.clear();

    // Border
    if (border) {
      this.graphics.fillStyle(border.color, border.opacity ?? 1);
      const radius = border.radius ?? 0;
      if (direction === "horizontal") {
        this.drawRoundedRect(
            this.anchorPos.x - border.thickness,
            this.anchorPos.y - border.thickness,
            barLength + 2 * border.thickness,
            thickness + 2 * border.thickness,
            radius
        );
      } else {
        this.drawRoundedRect(
            this.anchorPos.x - border.thickness,
            this.anchorPos.y - border.thickness,
            thickness + 2 * border.thickness,
            barLength + 2 * border.thickness,
            radius
        );
      }
    }

    // Background
    this.graphics.fillStyle(backgroundColor, 0.5);
    if (direction === "horizontal") {
      this.drawRoundedRect(this.anchorPos.x, this.anchorPos.y, barLength, thickness, 0);
    } else {
      this.drawRoundedRect(this.anchorPos.x, this.anchorPos.y, thickness, barLength, 0);
    }

    // Foreground
    this.graphics.fillStyle(fillColor, 1);
    if (direction === "horizontal") {
      this.drawRoundedRect(this.anchorPos.x, this.anchorPos.y, barLength * progress, thickness, 0);
    } else {
      const filled = barLength * progress;
      this.drawRoundedRect(this.anchorPos.x, this.anchorPos.y + (barLength - filled), thickness, filled, 0);
    }
  }

  private drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
    r > 0 ? this.graphics.fillRoundedRect(x, y, w, h, r) : this.graphics.fillRect(x, y, w, h);
  }

  private calculateWidth(value: number, minV: number, maxV: number, minW: number, maxW: number): number {
    if (value <= minV) return minW;
    if (value >= maxV) return maxW;
    const t = (Math.log(value) - Math.log(minV)) / (Math.log(maxV) - Math.log(minV));
    return minW + t * (maxW - minW);
  }

  private getAnchorPosition(length: number, thickness: number): void {
    const { position } = this.config;
    const { x: cx, y: cy } = this.container;
    const offset = this.config.offset;
    const halfW = this.displayWidth / 2;
    const halfH = this.displayHeight / 2;

    switch (position) {
      case "top":
        this.anchorPos.x = cx - length / 2;
        this.anchorPos.y = cy - halfH - offset - thickness;
        break;
      case "bottom":
        this.anchorPos.x = cx - length / 2;
        this.anchorPos.y = cy + halfH + offset;
        break;
      case "left":
        this.anchorPos.x = cx - halfW - offset - thickness;
        this.anchorPos.y = cy - length / 2;
        break;
      case "right":
        this.anchorPos.x = cx + halfW + offset;
        this.anchorPos.y = cy - length / 2;
        break;
    }
  }

  private updateDisplaySize(): void {
    const sprite = this.container.list.find(obj => obj instanceof Phaser.GameObjects.Sprite) as Phaser.GameObjects.Sprite;
    if (sprite) {
      this.displayWidth = sprite.displayWidth;
      this.displayHeight = sprite.displayHeight;
    }
  }
}
