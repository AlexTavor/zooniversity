export class AlphaSampler {
    private rt: Phaser.GameObjects.RenderTexture;

    constructor(scene: Phaser.Scene) {
        this.rt = scene.add.renderTexture(0, 0, 1, 1).setVisible(false);
    }

    async getAlphaAt(
        sprite: Phaser.GameObjects.Sprite,
        worldX: number,
        worldY: number,
    ): Promise<number> {
        if (!sprite.texture || !sprite.frame) return 0;

        const originOffsetX = sprite.displayOriginX;
        const originOffsetY = sprite.displayOriginY;

        const local = sprite
            .getWorldTransformMatrix()
            .applyInverse(worldX, worldY);
        const tx = Math.floor(local.x + originOffsetX);
        const ty = Math.floor(local.y + originOffsetY);

        if (tx < 0 || ty < 0 || tx >= sprite.width || ty >= sprite.height)
            return 0;

        this.rt.clear();
        this.rt.drawFrame(sprite.texture.key, sprite.frame.name, -tx, -ty);

        return new Promise<number>((resolve) => {
            this.rt.snapshotPixel(0, 0, (color) => {
                "alpha" in color && resolve(color?.alpha ?? 0);
            });
        });
    }

    destroy(): void {
        this.rt.destroy();
    }
}
