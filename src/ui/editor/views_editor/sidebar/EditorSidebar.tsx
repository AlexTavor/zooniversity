import React, { useState } from 'react';
import './EditorSidebar.css';
import {openPanel} from "../../../tools/useSidePanel.ts";
import {ViewEditorSpritePalette} from "./ViewEditorSpritePalette.tsx";
import {Sidebar} from "../../../shared/sidebar/Sidebar.tsx";
import {SidebarButton} from "../../../shared/sidebar/SidebarButton.tsx";
import {UndoRedo} from "../../../shared/sidebar/UndoRedo.tsx";
import {ViewEditorToolbox} from "../ViewEditorToolbox.tsx";

export const EditorSidebar: React.FC = () => {
    const [activePanel, setActivePanel] = useState<'palette' | null>('palette');

    const togglePanel = (panelId: 'palette') => {
        setActivePanel(activePanel === panelId ? null : panelId);
        openPanel('🎨 Palette', <ViewEditorSpritePalette />);
    };

    return (
        <div className="editor-wrapper">
            <Sidebar title="Views Editor">
                <SidebarButton
                    label="Sprites"
                    icon="🎨"
                    isActive={activePanel === 'palette'}
                    onClick={() => togglePanel('palette')}
                />
                <ViewEditorToolbox/>
                <div className="grow" />
                <UndoRedo />
            </Sidebar>
        </div>
    );
};
