import React, {useState, useMemo, useCallback} from 'react';
import {closePanel, openPanel} from "../../tools/useSidePanel.ts";
import { Sidebar } from "../../shared/sidebar/Sidebar.tsx";
import { SidebarButton } from "../../shared/sidebar/SidebarButton.tsx";
import { UndoRedo } from "../../shared/sidebar/UndoRedo.tsx";
import { MapEditorToolbox } from "./MapEditorToolbox.tsx";
import { SpritesPalette } from "./SpritesPalette.tsx";
import {EditorEvents, PaletteType} from "../../../game/consts/EditorEvents.ts";
import {CaveSpriteKeys, PlantSpriteKeys} from "../../../game/display/setup/SpriteLibrary.ts";
import {EventBus} from "../../../game/EventBus.ts";

interface PanelButton {
    id: PaletteType;
    label: string;
    icon: string;
    component: JSX.Element;
}

export const MapSidebar: React.FC = () => {
    const [activePanel, setActivePanel] = useState<PaletteType | null>(PaletteType.trees);

    const panelButtons = useMemo<PanelButton[]>(() => [
        {
            id: PaletteType.trees,
            label: 'Trees',
            icon: '🌲',
            component: <SpritesPalette spriteKeys={[...PlantSpriteKeys]} onSelectedKeyChange={()=>{EventBus.emit(EditorEvents.PaletteTypeSelected, PaletteType.trees);}}/>,
        },
        {
            id: PaletteType.caves,
            label: 'Caves',
            icon: '🪨',
            component: <SpritesPalette spriteKeys={[...CaveSpriteKeys]} onSelectedKeyChange={()=>{EventBus.emit(EditorEvents.PaletteTypeSelected, PaletteType.caves);}}/>,
        },
    ], []);

    const handleClick = useCallback((button: PanelButton) => {
        const isActive = activePanel === button.id;
        setActivePanel(isActive ? null : button.id);
        if (!isActive) {
            openPanel(`${button.icon} ${button.label}`, button.component);
        } else {
            closePanel();
        }
    }, [activePanel]);
    
    return (
        <div className="editor-wrapper">
            <Sidebar title="Map Editor">
                {panelButtons.map(button => (
                    <SidebarButton
                        key={button.id}
                        label={button.label}
                        icon={button.icon}
                        isActive={activePanel === button.id}
                        onClick={() => handleClick(button)}
                    />
                ))}
                <div className="grow" />
                <MapEditorToolbox />
                <div className="grow" />
                <UndoRedo />
            </Sidebar>
        </div>
    );
};
