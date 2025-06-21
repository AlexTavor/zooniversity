import Container = Phaser.GameObjects.Container;

export function sortContainerByY(container: Container) {
    const sorted = container.list
        .filter((obj) => obj instanceof Container)
        .sort((a, b) => {
            const aC = a as Container;
            const bC = b as Container;

            const aBottom = aC.y + aC.height * aC.scaleY;
            const bBottom = bC.y + bC.height * bC.scaleY;

            return aBottom - bBottom;
        });

    sorted.forEach((c) => container.bringToTop(c));
}
