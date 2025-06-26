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

        // Transform the world coordinate into the sprite's local space
        const local = sprite
            .getWorldTransformMatrix()
            .applyInverse(worldX, worldY);

        // local.x and local.y are now relative to the sprite's origin point.
        // We need to convert this to a coordinate relative to the top-left of the TRIMMED frame.

        // 1. Get the position of the origin within the trimmed frame (in pixels)
        const originInFrameX = sprite.frame.width * sprite.originX;
        const originInFrameY = sprite.frame.height * sprite.originY;

        // 2. Add the local coordinate to the origin's position to get the final
        //    coordinate within the trimmed frame.
        const tx = Math.floor(local.x + originInFrameX);
        const ty = Math.floor(local.y + originInFrameY);

        // 3. Check if this coordinate is within the bounds of the trimmed frame
        if (
            tx < 0 ||
            ty < 0 ||
            tx >= sprite.frame.width ||
            ty >= sprite.frame.height
        ) {
            return 0;
        }

        // This part remains the same, it correctly draws the requested pixel for snapshotting
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
