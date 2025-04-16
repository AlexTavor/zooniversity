import React, { useState } from 'react';
import { openPanel } from "../../tools/useSidePanel.ts";
import { MapEditorSpritePalette } from "./MapEditorSpritePalette.tsx";
import { Sidebar } from "../../shared/sidebar/Sidebar.tsx";
import { SidebarButton } from "../../shared/sidebar/SidebarButton.tsx";
import { UndoRedo } from "../../shared/sidebar/UndoRedo.tsx";
import {MapEditorToolbox} from "./MapEditorToolbox.tsx";

export const MapSidebar: React.FC = () => {
    const [activePanel, setActivePanel] = useState<'palette' | null>('palette');

    const togglePanel = (panelId: 'palette') => {
        setActivePanel(activePanel === panelId ? null : panelId);
        openPanel('🎨 Palette', <MapEditorSpritePalette />);
    };

    return (
        <div className="editor-wrapper">
            <Sidebar title="Map Editor">
                <SidebarButton
                    label="Trees"
                    icon="🌲"
                    isActive={activePanel === 'palette'}
                    onClick={() => togglePanel('palette')}
                />
                <div className="grow" />
                <MapEditorToolbox/>
                <div className="grow" />
                <UndoRedo />
            </Sidebar>
        </div>
    );
};
