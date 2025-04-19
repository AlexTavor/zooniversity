import {Scene} from "phaser";

export class Layers {
    public Sky :Phaser.GameObjects.Container;
    public Ground :Phaser.GameObjects.Container;
    public Caves :Phaser.GameObjects.Container;
    public Trees :Phaser.GameObjects.Container;
    
    constructor(scene:Scene) {
        this.Sky = scene.add.container();
        this.Ground = scene.add.container();
        this.Caves = scene.add.container();
        this.Trees = scene.add.container();
    }
    
    public destroy() {
        this.Sky.destroy();
        this.Ground.destroy();
        this.Caves.destroy();
        this.Trees.destroy();
    }
}