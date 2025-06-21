import {Scene} from "phaser";

export class Layers {
    public Sky :Phaser.GameObjects.Container;
    public Ground :Phaser.GameObjects.Container;
    public Caves :Phaser.GameObjects.Container;
    public Surface :Phaser.GameObjects.Container;
    public Tintable :Phaser.GameObjects.Container;
    public TintedRenderTextureLayer :Phaser.GameObjects.Container;
    public Icons :Phaser.GameObjects.Container;
    
    constructor(scene:Scene) {
        this.Sky = scene.add.container();
        
        this.Tintable = scene.add.container();

        this.Ground = scene.add.container();
        this.Caves = scene.add.container();
        this.Surface = scene.add.container();
        
        this.Tintable.add(this.Ground);
        this.Tintable.add(this.Caves);
        this.Tintable.add(this.Surface);

        // in Layers.ts constructor
        this.TintedRenderTextureLayer = scene.add.container();
        this.Icons = scene.add.container();

        this.TintedRenderTextureLayer.setDepth(10); // Renders behind icons
        this.Icons.setDepth(20);                   // Renders on top

        this.Icons.setScrollFactor(0); // Pin to camera
    }
    
    public destroy() {
        this.Sky.destroy();
        this.Ground.destroy();
        this.Caves.destroy();
        this.Surface.destroy();
        this.Icons.destroy();
        this.Tintable.destroy();
        this.TintedRenderTextureLayer?.destroy();
    }
}