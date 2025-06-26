import { View } from "../setup/View";

export function duplicateSprite(
    view: View,
    container: Phaser.GameObjects.Container,
): Phaser.GameObjects.Sprite {
    const originalSprite = view.getSprite()!;
    const duplicateSprite = view.viewContainer.scene.add.sprite(
        originalSprite.x,
        originalSprite.y,
        originalSprite.texture.key,
        originalSprite.frame.name,
    );

    duplicateSprite.setInteractive({ useHandCursor: false });
    duplicateSprite.setInteractive(false);
    container.add(duplicateSprite);

    return duplicateSprite;
}

export function syncDuplicateSprite(
    view: View,
    duplicateSprite: Phaser.GameObjects.Sprite,
): void {
    const originalSprite = view.getSprite()!;

    if (!originalSprite || !duplicateSprite || !originalSprite.active) {
        duplicateSprite?.setVisible(false);
        return;
    }

    // Set visibility and frame
    duplicateSprite.setVisible(originalSprite.parentContainer.visible);
    duplicateSprite.setFrame(originalSprite.frame.name);

    duplicateSprite.x = view.viewContainer.x;
    duplicateSprite.y = view.viewContainer.y;

    // Sync all other visual properties for a perfect match.
    duplicateSprite.rotation = originalSprite.parentContainer.rotation;
    duplicateSprite.setOrigin(originalSprite.originX, originalSprite.originY);

    duplicateSprite.scaleX =
        originalSprite.scaleX *
        (originalSprite.parentContainer.scaleX > 0 ? 1 : -1);
    duplicateSprite.scaleY = originalSprite.scaleY;

    duplicateSprite.alpha = originalSprite.alpha;

    duplicateSprite.removeInteractive();
}
