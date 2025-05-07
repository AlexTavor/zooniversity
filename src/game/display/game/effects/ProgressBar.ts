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
    border?: BorderConfig; // new optional nested config
}

export class ProgressBar {
    private container: Container;
    private graphics: Graphics;
    private config: Required<Omit<ProgressBarConfig, 'border'>> & { border?: BorderConfig };
    private isVisible: boolean = true;

    constructor(container: Container, config: ProgressBarConfig) {
        this.container = container;

        // Infer direction if missing
        const direction: Direction =
            config.direction ??
            (config.position === "left" || config.position === "right" ? "vertical" : "horizontal");

        this.config = {
            direction,
            fillColor: 0x00ff00,
            backgroundColor: 0x000000,
            ...config,
        };

        this.graphics = container.scene.add.graphics();
        container.add(this.graphics);
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

    update(delta: number): void {
        if (!this.isVisible || !this.config.valueRef) return;

        const { current, max } = this.config.valueRef;
        const { minWidth, maxWidth, minWidthValue, maxWidthValue } = this.config.size;
        const { fillColor, backgroundColor, direction, border } = this.config;

        const thickness = 6; // Fixed bar thickness
        const barLength = this.calculateWidth(max, minWidthValue, maxWidthValue, minWidth, maxWidth);
        const progress = Phaser.Math.Clamp(current / (max || 1), 0, 1);
        const pos = this.getAnchorPosition(barLength, thickness);

        this.graphics.clear();

        // Draw border if defined
        if (border) {
            const borderAlpha = border.opacity ?? 1;
            const outerRadius = border.radius ?? 0;

            this.graphics.fillStyle(border.color, borderAlpha);

            if (direction === "horizontal") {
                this.drawRoundedRect(
                    pos.x - border.thickness,
                    pos.y - border.thickness,
                    barLength + 2 * border.thickness,
                    thickness + 2 * border.thickness,
                    outerRadius
                );
            } else {
                this.drawRoundedRect(
                    pos.x - border.thickness,
                    pos.y - border.thickness,
                    thickness + 2 * border.thickness,
                    barLength + 2 * border.thickness,
                    outerRadius
                );
            }
        }

        // Draw background
        this.graphics.fillStyle(backgroundColor, 0.5);
        if (direction === "horizontal") {
            this.drawRoundedRect(pos.x, pos.y, barLength, thickness, 0);
        } else {
            this.drawRoundedRect(pos.x, pos.y, thickness, barLength, 0);
        }

        // Draw foreground
        this.graphics.fillStyle(fillColor, 1);
        if (direction === "horizontal") {
            this.drawRoundedRect(pos.x, pos.y, barLength * progress, thickness, 0);
        } else {
            const filled = barLength * progress;
            this.drawRoundedRect(pos.x, pos.y + (barLength - filled), thickness, filled, 0);
        }
    }

    private drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
        if (r > 0) {
            this.graphics.fillRoundedRect(x, y, w, h, r);
        } else {
            this.graphics.fillRect(x, y, w, h);
        }
    }

    private calculateWidth(
        value: number,
        minValue: number,
        maxValue: number,
        minWidth: number,
        maxWidth: number
    ): number {
        if (value <= minValue) return minWidth;
        if (value >= maxValue) return maxWidth;
        const logMin = Math.log(minValue);
        const logMax = Math.log(maxValue);
        const logValue = Math.log(value);
        const t = (logValue - logMin) / (logMax - logMin);
        return minWidth + t * (maxWidth - minWidth);
    }

    private getAnchorPosition(length: number, thickness: number): { x: number; y: number } {
        const { position } = this.config;
        const { x: cx, y: cy, displayWidth, displayHeight } = this.container;
        const offset = this.config.offset;

        switch (position) {
            case "top":
                return { x: cx - length / 2, y: cy - displayHeight / 2 - offset - thickness };
            case "bottom":
                return { x: cx - length / 2, y: cy + displayHeight / 2 + offset };
            case "left":
                return { x: cx - displayWidth / 2 - offset - thickness, y: cy - length / 2 };
            case "right":
                return { x: cx + displayWidth / 2 + offset, y: cy - length / 2 };
            default:
                return { x: cx, y: cy };
        }
    }
}
