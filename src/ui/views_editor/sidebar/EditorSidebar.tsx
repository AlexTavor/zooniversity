import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarButton } from './SidebarButton';
import './EditorSidebar.css';
import {SpritePalette} from "../sprite_palette/SpritePalette.tsx";
import {UndoRedo} from "./UndoRedo.tsx";

export const EditorSidebar: React.FC = () => {
    const [activePanel, setActivePanel] = useState<'palette' | null>('palette');

    const togglePanel = (panelId: 'palette') => {
        setActivePanel(activePanel === panelId ? null : panelId);
    };

    return (
        <div className="editor-wrapper">
            <Sidebar title="TOOLS">
                <SidebarButton
                    label="Palette"
                    icon="🎨"
                    isActive={activePanel === 'palette'}
                    onClick={() => togglePanel('palette')}
                />
                <div className="grow" />
                <UndoRedo />
            </Sidebar>

            <div className={`editor-panel ${activePanel === 'palette' ? 'open' : 'closed'}`}>
                <SpritePalette />
            </div>
        </div>
    );
};
