import {DisplayModule} from "../setup/DisplayModule.ts";
import {GameDisplay} from "../GameDisplay.ts";
import {Config} from "../../config/Config.ts";

export class GroundDisplayModule extends DisplayModule<GameDisplay> {
    public init(display: GameDisplay): void {
        // --- Generate Map Data with Random Tile Indices ---
        const mapData: number[][] = [];

        for (let y = 0; y < Config.Map.HeightInTiles; y++) {
            const row: number[] = [];
            for (let x = 0; x < Config.Map.HeightInTiles; x++) {
                // Assign a random tile index (0-5) to each cell
                const randomIndex = Phaser.Math.Between(0, 3);
                row.push(randomIndex);
            }
            mapData.push(row);
        }

        // --- Create the Tilemap ---
        // Use the DISPLAY size for the tilemap grid dimensions
        const map = display.scene.make.tilemap({
            data: mapData,
            tileWidth: Config.AnimImports.FrameWidth,
            tileHeight: Config.AnimImports.FrameHeight,
        });

        // --- Add the Tileset Image to the Map ---
        // Use the SOURCE size when adding the tileset image
        const tileset = map.addTilesetImage(
            'ground_tiles_set',   // An internal name for the tileset within the map
            'ground_tiles_sheet', // The key used in preload() for the spritesheet
            Config.AnimImports.FrameWidth,      // Use source tile width here
            Config.AnimImports.FrameHeight      // Use source tile height here
        );

        if (!tileset) {
            console.error("Failed to add tileset. Check cache key ('ground_tiles_sheet') and image loading.");
            return;
        }

        // --- Create the Tilemap Layer ---
        // Layer is created based on the map grid (display size)
        const layer = map.createLayer(0, tileset, 0, 0);
        
        if (!layer) {
            console.error("Failed to create tilemap layer. Check tileset object.");
            return;
        }

        // Optional: Set depth if needed to ensure it's behind other sprites
        layer.setDepth(-1);
    }

    public update(_: number): void {
        // Update the ground display module
    }

    public destroy(): void {
        // Clean up resources
    }
}