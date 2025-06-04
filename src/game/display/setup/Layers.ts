import {Scene} from "phaser";

export class Layers {
    public Sky :Phaser.GameObjects.Container;
    public Ground :Phaser.GameObjects.Container;
    public Caves :Phaser.GameObjects.Container;
    public Surface :Phaser.GameObjects.Container;
    public Icons :Phaser.GameObjects.Container;
    public Tintable :Phaser.GameObjects.Container;
    
    constructor(scene:Scene) {
        this.Sky = scene.add.container();
        
        this.Tintable = scene.add.container();

        this.Ground = scene.add.container();
        this.Caves = scene.add.container();
        this.Surface = scene.add.container();
        
        this.Tintable.add(this.Ground);
        this.Tintable.add(this.Caves);
        this.Tintable.add(this.Surface);

        this.Icons = scene.add.container();
    }
    
    public destroy() {
        this.Sky.destroy();
        this.Ground.destroy();
        this.Caves.destroy();
        this.Surface.destroy();
        this.Icons.destroy();
    }
}