import { DisplayModule } from "./setup/DisplayModule.ts";
import {ECS, Entity} from "../ECS.ts";
import { Layers } from "./setup/Layers.ts";
import {Config} from "../config/Config.ts";
import {createView} from "./setup/ViewStore.ts";
import {View} from "./setup/View.ts";

export interface GameDisplayContext {
    scene: Phaser.Scene;
    layers: Layers;
    ecs: ECS;
    viewsByEntity: Map<Entity, View>;
    iconsByEntity: Map<Entity, View>;
}

export type GameDisplayModule = DisplayModule<GameDisplayContext>;

export class GameDisplay implements GameDisplayContext {
    modules: GameDisplayModule[];
    scene: Phaser.Scene;
    ecs: ECS;
    layers: Layers;
    hill: View;
    
    viewsByEntity:Map<Entity, View> = new Map();
    iconsByEntity:Map<Entity, View> = new Map();
    tintTexture: Phaser.GameObjects.RenderTexture;
    uiCamera: Phaser.Cameras.Scene2D.Camera;

    init(
        scene: Phaser.Scene, 
        ecs: ECS, 
        modules: GameDisplayModule[])
    {
        this.scene = scene;
        this.ecs = ecs;
        this.layers = new Layers(scene);
        this.modules = modules;
        
        for (const module of this.modules) {
            module.init(this);
        }
        
        this.setHill();

        this.uiCamera = scene.cameras.add(0, 0, Config.Display.Width, Config.Display.Height);
        this.uiCamera.ignore(this.layers.Sky);
        this.uiCamera.setBounds(0, 0, Config.GameWidth, Config.GameHeight);

        this.initRt(scene);

        this.layers.Tintable.setVisible(false);
    }
    
    private initRt(scene: Phaser.Scene) {
        this.initDisplaySizeRt(scene);

        this.tintTexture.setPipeline('TimeTint');
        this.layers.Tintable.setVisible(false);
    }

    private initDisplaySizeRt(scene: Phaser.Scene) {
        this.tintTexture = scene.add.renderTexture(0, 0, Config.Display.Width, Config.Display.Height);
        this.layers.TintedRenderTextureLayer.add(this.tintTexture);
        this.tintTexture.setScrollFactor(0);
        this.tintTexture.setOrigin(0, 0);
        this.tintTexture.setScale(1, 1);

        const mainCamera = scene.cameras.main;
        this.tintTexture.camera.setOrigin(mainCamera.originX, mainCamera.originY);
        mainCamera.ignore(this.tintTexture);
    }

    private updateRt() {
        const mainCamera = this.scene.cameras.main;
        this.tintTexture.clear();
        this.tintTexture.camera.setScroll(mainCamera.scrollX, mainCamera.scrollY);
        this.tintTexture.camera.setZoom(mainCamera.zoom);
        this.tintTexture.draw(this.layers.Tintable);
    }

    public setHill(): void {
        // Why offset?
        const hOffset = 100;
        const wOffset = 100;

        const hillPosition = {
            x: Math.round(Config.GameWidth / 2 + wOffset),
            y: Math.round(Config.GameHeight / 2 + hOffset)
        };


        const hillDef = createView({
            position: hillPosition,
            spriteName: 'hill',
            selectable: false,
        });
        
        this.hill = new View(0, {}, hillDef, this.layers.Ground, this.scene);
        // this.hill.applyEffect(EffectType.Shader, { shader: "TimeTint" });
    }

    public destroy() {
        this.modules.forEach(module => module.destroy());
        this.layers.destroy();
    }

    public update(delta: number) {
        this.modules.forEach(module => module.update(delta));
        this.viewsByEntity.forEach(view => view.update(delta));
        this.iconsByEntity.forEach(view => view.update(delta));

        this.updateIcons();

        this.updateRt();
    }

    private updateIcons() {
    const camera = this.scene.cameras.main;
    const zoom = camera.zoom;

    const x = -camera.scrollX * zoom + camera.width * 0.5 * (1 - zoom);
    const y = -camera.scrollY * zoom + camera.height * 0.5 * (1 - zoom);

    this.layers.Icons.setPosition(x, y);
    this.layers.Icons.setScale(zoom);
    }
}
