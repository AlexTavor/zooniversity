import {DisplayModule} from "../setup/DisplayModule.ts";
import {GameDisplay} from "../GameDisplay.ts";
import {Config} from "../../config/Config.ts";
import {PlantView} from "./PlantView.ts";

export class PlantsDisplayModule extends DisplayModule<GameDisplay> {
    private plantViews: Map<number, PlantView> = new Map();
    
    public init(display: GameDisplay): void {
        // Initialize plant animations
        PlantView.initAnimations(display.scene);

        var numTrees = 2000; // Number of trees to create
        var positions = [];
        // Create and display plants
        for (let i = 0; i < numTrees; i++) {
            const pos = {
                x: Phaser.Math.Between(0, Config.GameWidth),
                y: Phaser.Math.Between(0, Config.GameHeight)
            };
            
            positions.push(pos);
        }
        
        // sort positions by y
        positions.sort((a, b) => a.y - b.y);
        
        // Create and display plants
        for (let i = 0; i < numTrees; i++) {
            const pos = positions[i];
            // Create a new PlantView instance for each plant
            this.plantViews.set(i, new PlantView(display, i, pos));
        }
    }
    
    public update(_: number): void {
        // Update plants display
        this.plantViews.forEach((plantView) => {
            if (plantView) {
                plantView.update();
            }
        });
    }
    
    public destroy(): void {
        // Clean up plants display
        this.plantViews.forEach((plantView) => {
            if (plantView) {
                plantView.destroy();
            }
        });
        
        this.plantViews.clear();
    }
}