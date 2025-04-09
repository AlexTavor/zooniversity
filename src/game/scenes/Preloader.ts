import { Scene } from 'phaser';
import { Config } from '../config/Config';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.spritesheet(
            'ground_tiles_sheet',     // Unique key for this ground tileset
            'ground.png',
            {
                frameWidth: Config.AnimImports.FrameWidth,
                frameHeight: Config.AnimImports.FrameHeight,
                endFrame: Config.AnimImports.NumberOfFrames-1
            }
        );

        this.load.setPath('assets/plants');


        for (let i = 0; i < Config.AnimImports.NumberOfTrees; i++) {
            this.load.spritesheet(
                `tree${i}`, 
                `tree${i}.png`,
                {
                    frameWidth: Config.AnimImports.FrameWidth*2,
                    frameHeight: Config.AnimImports.FrameHeight*2,
                    endFrame: Config.AnimImports.NumberOfFrames-1
                }
            );
        }
        
        for (let i = 0; i < Config.AnimImports.NumberOfBushes; i++) {
            this.load.spritesheet(
                `bush${i}`,
                `bush${i}.png`,
                {
                    frameWidth: Config.AnimImports.FrameWidth*2,
                    frameHeight: Config.AnimImports.FrameHeight*2,
                    endFrame: Config.AnimImports.NumberOfFrames-1
                }
            );
        }
    }

    create ()
    {
        this.scene.start('Game');
    }
}
