import { Scene } from "phaser";
import { Config } from "../config/Config";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        this.load.json("panelRegistry", "assets/data/panels.json");

        this.load.atlas(
            "plants",
            "assets/trees/plants.png",
            "assets/trees/plants.json",
        );

        this.load.setPath("assets/plants");

        const animFrameConfig = {
            frameWidth: Config.AnimImports.FrameWidth * 2,
            frameHeight: Config.AnimImports.FrameHeight * 2,
            endFrame: Config.AnimImports.NumberOfFrames - 1,
        };

        for (let i = 0; i < Config.AnimImports.NumberOfTrees; i++) {
            this.load.spritesheet(`tree${i}`, `tree${i}.png`, animFrameConfig);
        }

        for (let i = 0; i < Config.AnimImports.NumberOfBushes; i++) {
            this.load.spritesheet(`bush${i}`, `bush${i}.png`, animFrameConfig);
        }

        this.load.setPath("assets/hill");

        const staticFrameConfig = {
            frameWidth: Config.AnimImports.StaticWidth,
            frameHeight: Config.AnimImports.StaticHeight,
            endFrame: 0,
        };

        const caveFrameConfig = {
            frameWidth: Config.AnimImports.StaticHeight,
            frameHeight: Config.AnimImports.StaticHeight,
            endFrame: 0,
        };

        this.load.spritesheet("hill", "hill.png", staticFrameConfig);
        this.load.spritesheet(
            "home-lvl-1",
            "home-lvl-1.png",
            staticFrameConfig,
        );
        this.load.spritesheet(
            "home-lvl-1-inside",
            "home-lvl-1-inside.png",
            staticFrameConfig,
        );
        this.load.spritesheet(
            "kitchen-lvl-1",
            "kitchen-lvl-1.png",
            staticFrameConfig,
        );
        this.load.spritesheet(
            "kitchen-lvl-1-inside",
            "kitchen-lvl-1-inside.png",
            staticFrameConfig,
        );
        this.load.spritesheet("cave", "cave.png", caveFrameConfig);
        this.load.spritesheet("wood_dojo", "wood_dojo.png", caveFrameConfig);

        this.load.setPath("assets/icons");
        this.load.spritesheet("food", "food_icon.png", caveFrameConfig);

        this.load.setPath("assets/maps");
        this.load.json("forestMap", "forestMap.json");

        this.load.setPath("assets/clouds");

        for (let i = 0; i < 4; i++) {
            this.load.spritesheet(
                `cloud${i}`,
                `cloud${i}.png`,
                caveFrameConfig,
            );
        }

        this.load.setPath("assets");

        this.load.spritesheet("night_sky", "night_sky.png", caveFrameConfig);

        const charFrameConfig = {
            frameWidth: Config.AnimImports.StaticHeight,
            frameHeight: Config.AnimImports.StaticWidth,
            endFrame: 0,
        };

        this.load.setPath("assets/characters/booker");
        this.load.spritesheet(
            "booker_char",
            "booker_char.png",
            charFrameConfig,
        );
        this.load.spritesheet(
            "booker_icon",
            "booker_icon.png",
            caveFrameConfig,
        );

        this.load.setPath("assets/icons");
        this.load.spritesheet("axe_icon", "axe_icon.png", caveFrameConfig);
    }

    create() {
        this.scene.start(Config.EntryScene);
    }
}
