import {MapDefinition, MapObject, MapObjectType} from './MapTypes';
import {ViewDefinition} from "../../setup/ViewDefinition.ts";
import {Config} from "../../../config/Config.ts";
import {Pos} from "../../../../utils/Math.ts";
import {createView} from "../../setup/ViewStore.ts";
import {SpriteLibrary} from "../../setup/SpriteLibrary.ts";
import {getSelectedSpriteKey} from "../common/PaletteState.ts";
import { MapObjectsStore } from './MapObjectsStore';
import {EventBus} from "../../../EventBus.ts";
import {EditorEvent} from "../../../consts/EditorEvent.ts";

export class MapEditorState {
    dirty = false;
    private objectStore = new MapObjectsStore();

    public currentMapName: string = 'Untitled';
    public hill?: ViewDefinition;

    public createNew(): void {
        this.currentMapName = 'Untitled';
        this.hill = undefined;
        this.objectStore = new MapObjectsStore();
        this.setHill();
    }

    public addObjectAtWorldPosition(pos: Pos, type:MapObjectType = 'tree'): void {
        const spriteKey = getSelectedSpriteKey();
        if (!spriteKey) return;

        var spriteDef = SpriteLibrary[spriteKey];
        
        const pxPu = Config.Display.PixelsPerUnit;
        const size = {
            x: spriteDef.defaultSize.x / pxPu,
            y: spriteDef.defaultSize.y / pxPu
        };
        
        const view = createView({ spriteName: spriteDef.key, position: pos, size });
        this.objectStore.create({ view, type });
        this.markDirty();
    }

    public removeObject(id: number): void {
        this.objectStore.remove(id);
        this.markDirty();
    }

    public loadMap(def: MapDefinition): void {
        this.currentMapName = def.name;
        this.hill = def.hill;
        this.objectStore.setAll(def.objects);
        this.markDirty();
    }

    public getMapDefinition(): MapDefinition {
        return {
            name: this.currentMapName,
            hill: this.hill!,
            objects: this.objectStore.getAll()
        };
    }

    public setHill(): void {
        const wFactor = Config.AnimImports.StaticWidth / Config.Display.Width;
        const hFactor = Config.AnimImports.StaticHeight / Config.Display.Height;
        
        const hillSize = {
            x: Config.Display.Width / Config.Display.PixelsPerUnit * wFactor,
            y: Config.Display.Height / Config.Display.PixelsPerUnit * hFactor
        };

        // Why offset?
        const hOffset = 100;
        const wOffset = 100;
        
        const hillPosition = {
            x: Math.round(Config.GameWidth / 2 + wOffset),
            y: Math.round(Config.GameHeight / 2 + hOffset)
        };

        
        this.hill = createView({
            size: hillSize,
            position: hillPosition,
            spriteName: 'hill'
        });
        
        this.markDirty();
    }
    
    public markDirty(): void {
        this.dirty = true;
        EventBus.emit(EditorEvent.MapUpdated, this.getMapDefinition());
    }

    public consumeDirty(): boolean {
        if (this.dirty) {
            this.dirty = false;
            return true;
        }
        return false;
    }
    
    public getViewById(id: number): ViewDefinition | null {
        return this.objectStore.get(id)?.components?.view ?? null;
    }
    
    public getObjectById(id: number): MapObject | null {
        return this.objectStore.get(id);
    }
}
