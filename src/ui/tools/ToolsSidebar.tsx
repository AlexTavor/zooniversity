import React from 'react';
import {EditorTool} from "../../game/display/editor/EditorHost.ts";
import {ToolButton} from "./ToolButton.tsx";
import {EditorSidebar} from "../editor/views_editor/sidebar/EditorSidebar.tsx";
import {MapSidebar} from "../editor/map_editor/MapSidebar.tsx";


export function ToolSidebar({ current }: { current: EditorTool }) {
    const renderToolSidebar = () => {
        switch (current) {
            case 'map':
                return <MapSidebar />;
            case 'views':
                return <EditorSidebar />;
            default:
                return null;
        }
    };

    return (
        <div className="tool-sidebar">
            <div className="tool-button-group">
                <ToolButton tool="map" current={current} />
                <ToolButton tool="views" current={current} />
            </div>

            <div className="tool-divider" />

            <div className="tool-subpanel">
                {renderToolSidebar()}
            </div>
        </div>
    );
}