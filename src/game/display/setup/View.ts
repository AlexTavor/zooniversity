import Phaser from "phaser";
import { ViewDefinition, ViewType } from "./ViewDefinition";
import { Naming } from "../../consts/Naming";
import { Config } from "../../config/Config";
import { SpriteKey, SpriteLibrary } from "./SpriteLibrary";
import { EffectType, ViewEffectController } from "./ViewEffectController";

export class View {
    public readonly id: number;
    public readonly viewDefinition: ViewDefinition;
    public readonly viewContainer: Phaser.GameObjects.Container;
    public readonly subViews: View[] = [];

    public type = ViewType.NONE;
    public selectable = true;

    sprite: Phaser.GameObjects.Sprite;
    private readonly effects: ViewEffectController;

    constructor(
        id: number,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
        parentContainer: Phaser.GameObjects.Container,
        scene: Phaser.Scene,
    ) {
        this.id = id;
        this.viewDefinition = viewDefinition;
        this.type = viewDefinition.type;
        this.selectable = viewDefinition.selectable ?? true;

        viewDefinition.position.x = Math.round(viewDefinition.position.x);
        viewDefinition.position.y = Math.round(viewDefinition.position.y);

        this.viewContainer = scene.add.container(
            viewDefinition.position.x,
            viewDefinition.position.y,
        );
        this.viewContainer.name = `${Naming.VIEW}${id}`;
        parentContainer.add(this.viewContainer);

        this.initSprite(scene);

        for (const subViewId of viewDefinition.subViews) {
            const subDef = views[subViewId];
            if (subDef) {
                const subView = new View(
                    subViewId,
                    views,
                    subDef,
                    this.viewContainer,
                    scene,
                );
                this.subViews.push(subView);
            }
        }

        this.effects = new ViewEffectController(this);
    }

    private initSprite(scene: Phaser.Scene): void {
        const { spriteName, atlasName, size, type } = this.viewDefinition;
        if (!spriteName && !atlasName) return;

        const sprite = atlasName
            ? scene.add.sprite(0, 0, "plants", atlasName)
            : scene.add.sprite(0, 0, spriteName);

        sprite.name = `${Naming.SPRITE}${this.id}`;
        this.viewContainer.add(sprite);

        sprite.setOrigin(0.5, type === ViewType.TREE ? 1 : 0.5);
        // sprite.setFrame(frame);
        sprite.setInteractive({ useHandCursor: false });

        const defaultSize = SpriteLibrary[spriteName as SpriteKey]
            ?.defaultSize ?? { x: 1, y: 1 };
        const pxPerUnit = Config.Display.PixelsPerUnit;
        sprite.setDisplaySize(
            defaultSize.x * pxPerUnit * size.x,
            defaultSize.y * pxPerUnit * size.y,
        );

        this.sprite = sprite;
    }

    public getSprite(): Phaser.GameObjects.Sprite | undefined {
        return this.sprite;
    }

    public syncSprite(spriteName: string): void {
        if (this.viewDefinition.spriteName === spriteName) return;

        this.sprite?.destroy();

        this.viewDefinition.spriteName = spriteName;
        this.initSprite(this.viewContainer.scene);
    }

    public applyEffect(type: EffectType, opts?: unknown): void {
        this.effects.apply(type, opts);
    }

    public clearEffect(type: EffectType): void {
        this.effects.clear(type);
    }

    public clearAllEffects(): void {
        this.effects.clearAll();
    }

    public update(delta: number): void {
        this.effects.update(delta);
    }

    public sortSubviewsByY(): void {
        const containers = this.viewContainer.list.filter(
            (obj) => obj instanceof Phaser.GameObjects.Container,
        ) as Phaser.GameObjects.Container[];

        containers
            .sort(
                (a, b) =>
                    a.y * a.scaleY -
                    a.height / 2 -
                    (b.y * b.scaleY - b.height / 2),
            )
            .forEach((c) => this.viewContainer.bringToTop(c));

        this.subViews.forEach((subView) => subView.sortSubviewsByY());
    }

    public destroy(): void {
        this.clearAllEffects();
        this.sprite?.destroy();
        this.viewContainer.destroy();
    }
}
