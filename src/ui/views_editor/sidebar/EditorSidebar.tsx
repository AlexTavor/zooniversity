import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarButton } from './SidebarButton';
import './EditorSidebar.css';
import {SpritePalette} from "../SpritePalette.tsx";

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
            </Sidebar>

            <div className={`editor-panel ${activePanel === 'palette' ? 'open' : 'closed'}`}>
                <SpritePalette />
            </div>
        </div>
    );
};
