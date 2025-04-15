import { MapDefinition, MapObject } from './MapTypes';
import {ViewDefinition} from "../../setup/ViewDefinition.ts";
import {createView} from "../../views_editor/ViewStore.ts";
import {Config} from "../../../config/Config.ts";

export class MapEditorState {
    private nextId = 1;
    private dirty = false;

    public currentMapName: string = 'Untitled';
    public hill?: ViewDefinition;
    public objects: Record<number, MapObject> = {};

    public createNew(): void {
        this.currentMapName = 'Untitled';
        this.hill = undefined;
        this.objects = {};
        this.nextId = 1;
        
        this.setHill();
    }

    public setHill(): void {
        const hillSize = {
            x: Config.GameWidth / Config.Display.PixelsPerUnit / 5.8,
            y: Config.GameHeight / Config.Display.PixelsPerUnit / 4.8
        };

        const hillPosition = {
            x: Config.GameWidth / 2,
            y: Config.GameHeight / 2 + hillSize.y*Config.Display.PixelsPerUnit / 2
        };


        this.hill = createView({
            size: hillSize,
            position: hillPosition,
            spriteName: 'hill'
        });
        
        this.markDirty();
    }


    public addTree(view: ViewDefinition): number {
        const id = this.nextId++;
        this.objects[id] = {
            id,
            type: 'tree',
            components: { view }
        };
        this.markDirty();
        return id;
    }

    public removeObject(id: number): void {
        delete this.objects[id];
        this.markDirty();
    }

    public loadMap(def: MapDefinition): void {
        this.currentMapName = def.name;
        this.hill = def.hill;
        this.objects = def.objects;
        this.nextId = Math.max(...Object.keys(def.objects).map(Number), 0) + 1;
        this.markDirty();
    }

    public getMapDefinition(): MapDefinition {
        return {
            name: this.currentMapName,
            hill: this.hill!,
            objects: this.objects
        };
    }

    public markDirty(): void {
        this.dirty = true;
    }

    public consumeDirty(): boolean {
        if (this.dirty) {
            this.dirty = false;
            return true;
        }
        return false;
    }
}
