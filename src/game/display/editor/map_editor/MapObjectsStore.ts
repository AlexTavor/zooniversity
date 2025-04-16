import { MapObject } from './MapTypes';
import { ViewDefinition } from '../../setup/ViewDefinition';
import {Config} from "../../../config/Config.ts";

export class MapObjectsStore {
    private nextId = 1;
    private objects: Record<number, MapObject> = {};

    public create({ view }: { view?: ViewDefinition }): MapObject {
        const obj: MapObject = {
            id: this.nextId++,
            type: 'tree',
            components: { view },
            zHint: view ? this.getBottomY(view) : undefined
        };
        this.objects[obj.id] = obj;
        return obj;
    }

    public remove(id: number): void {
        delete this.objects[id];
    }

    public getAll(): Record<number, MapObject> {
        return this.objects;
    }

    public setAll(objs: Record<number, MapObject>): void {
        this.objects = objs;
        this.nextId = Math.max(...Object.keys(objs).map(Number), 0) + 1;
    }

    get(id: number) {
        return this.objects[id];
    }
    
    getBottomY(view: ViewDefinition): number {
        const { position, size } = view;

        const ppu = Config.Display.PixelsPerUnit;
        const halfHeight = size.y / 2;
        return position.y/ppu + halfHeight * ppu;
    }
}
