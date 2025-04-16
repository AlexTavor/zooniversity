import { useSyncExternalStore } from 'react';
import {MapDefinition} from "../../../game/display/editor/map_editor/MapTypes.ts";
import {EventBus} from "../../../game/EventBus.ts";
import {EditorEvents} from "../../../game/consts/EditorEvents.ts";

let currentSnapshot: MapDefinition;

EventBus.on(EditorEvents.MapUpdated, (snapshot: MapDefinition) => {
    currentSnapshot = snapshot;
    listeners.forEach(fn => fn());
});

const listeners = new Set<() => void>();

export function useMapSnapshot(): MapDefinition {
    useSyncExternalStore(
        (cb) => {
            listeners.add(cb);
            return () => listeners.delete(cb);
        },
        () => currentSnapshot
    );

    return currentSnapshot;
}
