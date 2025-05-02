//@ts-ignore
import React, {useState} from 'react';
import {FileManagementUi} from "../../shared/file_management/FileManagementUi.tsx";
import {MapDefinition} from "../../../game/display/editor/map_editor/MapTypes.ts";
import {useMapSnapshot} from "./useMapSnapshot.tsx";
import {EventBus} from "../../../game/EventBus.ts";
import {EditorEvent} from "../../../game/consts/EditorEvent.ts";

export function MapSaveLoadWidget() {
    const state = useMapSnapshot();

    const [name, setName] = useState<string>(state?.name ?? '');
    
    const handleSave = (name: string) => {
        const data = state;
        data.name = name;
        setName(name);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoad = async (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (!result || typeof result !== 'string') return;
        const data: MapDefinition = JSON.parse(result);
        setName(data.name);
        EventBus.emit(EditorEvent.MapLoaded, data);
    };

    return (
        <FileManagementUi
            name={name}
            validExtensions={['.json']}
            save={handleSave}
            onLoad={handleLoad}
            onNameChange={setName}
        />
    );
}
