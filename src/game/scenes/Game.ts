import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }
    
    update(time: number, delta: number) {
        super.update(time, delta);
        
        // this.gameLogic.update(delta);
        // this.gameDisplay.update(delta);
        //
        // EventBus.emit(UiEvents.GameUpdate, this);
    }
    
    create ()
    {
        // this.camera = this.cameras.main;
        // this.camera.setBackgroundColor(0x00ff00);

        // this.background = this.add.image(512, 384, 'background');
        // this.background.setAlpha(0.5);

        this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 380, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(0);

        EventBus.emit('current-scene-ready', this);
    }
}
