import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SidebarButton } from './SidebarButton';
import './EditorSidebar.css';
import {SpritePalette} from "../sprite_palette/SpritePalette.tsx";
import {UndoRedo} from "./UndoRedo.tsx";
import {openPanel} from "../../../tools/useSidePanel.ts";
import {Toolbox} from "../toolbox/Toolbox.tsx";

export const EditorSidebar: React.FC = () => {
    const [activePanel, setActivePanel] = useState<'palette' | null>('palette');

    const togglePanel = (panelId: 'palette') => {
        setActivePanel(activePanel === panelId ? null : panelId);
        openPanel('🎨 Palette', <SpritePalette />);
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
                <Toolbox/>
                <div className="grow" />
                <UndoRedo />
            </Sidebar>
        </div>
    );
};
