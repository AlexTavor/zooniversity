import {Scene} from "phaser";

export class Layers {
    public Ground :Phaser.GameObjects.Container;
    public Plants :Phaser.GameObjects.Container;
    
    constructor(scene:Scene) {
        this.Ground = scene.add.container();
        this.Plants = scene.add.container();
    }
    
    public destroy() {
        this.Ground.destroy();
        this.Plants.destroy();
    }
}