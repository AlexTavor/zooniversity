import Phaser from "phaser";
import {ViewDefinition, ViewType} from "./ViewDefinition.ts";
import {Naming} from "../../consts/Naming.ts";
import {Config} from "../../config/Config.ts";
import {SpriteKey, SpriteLibrary} from "./SpriteLibrary.ts";

export class View {
    public readonly viewDefinition: ViewDefinition;
    public sprite: Phaser.GameObjects.Sprite;
    public viewContainer: Phaser.GameObjects.Container;
    public subViews: View[] = [];
    public type = ViewType.NONE;
    public selectable = true;
    
    constructor(
        public id:number,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
        parentContainer: Phaser.GameObjects.Container,
        scene: Phaser.Scene
    ) {
        this.viewDefinition = viewDefinition;
        this.type = viewDefinition.type;
        
        viewDefinition.position.x = Math.round(viewDefinition.position.x);
        viewDefinition.position.y = Math.round(viewDefinition.position.y);
        
        this.viewContainer = scene.add.container(viewDefinition.position.x, viewDefinition.position.y);
        parentContainer.add(this.viewContainer);
        this.viewContainer.name = `${Naming.VIEW}${id}`;
        
        if (viewDefinition.spriteName) {
            this.addSprite(viewDefinition, scene, id);
        }

        const config = SpriteLibrary[viewDefinition.spriteName as SpriteKey];
        const pxPerUnit = Config.Display.PixelsPerUnit;
        this.sprite?.setDisplaySize(config.defaultSize.x * pxPerUnit, config.defaultSize.y * pxPerUnit);

        for (const subViewId of viewDefinition.subViews) {
            const subViewDefinition = views[subViewId];
            if (subViewDefinition) {
                const subView = new View(subViewId, views, subViewDefinition, this.viewContainer, scene);
                this.subViews.push(subView);
            }
        }
    }

    public sortSubviewsByY(): void {
        const containers = this.viewContainer.list.filter(
            obj => obj instanceof Phaser.GameObjects.Container
        ) as Phaser.GameObjects.Container[];

        containers.sort((a, b) =>
            ((a.y * a.scaleY) - a.height/2) - ((b.y * b.scaleY) - (b.height/2))
        );
        containers.forEach(c => this.viewContainer.bringToTop(c));
        
        this.subViews.forEach(subView => subView.sortSubviewsByY());
    }

    private addSprite(viewDefinition: ViewDefinition, scene: Phaser.Scene, id: number = this.id): void {
        this.sprite = scene.add.sprite(0, 0, viewDefinition.spriteName);
        this.sprite.name = `${Naming.SPRITE}${id}`;
        this.viewContainer.add(this.sprite);
        this.sprite.setInteractive({ useHandCursor: true });
        if (viewDefinition.type == ViewType.TREE) {
            this.sprite.setOrigin(0.5, 1);
        } else {
            this.sprite.setOrigin(0.5, 0.5);

        }
        this.sprite.setFrame(viewDefinition.frame);
        this.sprite.setPipeline('TimeTint');
    }
}
