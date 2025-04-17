import {Scene} from "phaser";

export class Layers {
    public Ground :Phaser.GameObjects.Container;
    
    constructor(scene:Scene) {
        this.Ground = scene.add.container();
    }
    
    public destroy() {
        this.Ground.destroy();
    }
}