// @ts-ignore
import React, { useEffect, useState } from 'react';
import { ToolSidebar } from './ToolsSidebar.tsx';
import {EditorTool, TOOL_SELECTED_EVENT} from "../../game/display/editor/EditorHost.ts";
import {EventBus} from "../../game/EventBus.ts";
import {SidePanelHost} from "./SidePanelHost.tsx";

export function ToolsContainer() {
    const [tool, setTool] = useState<EditorTool>(() => {
        return (localStorage.getItem('editor-tool') as EditorTool) ?? 'map';
    });

    // @ts-ignore
    useEffect(() => {
        EventBus.on(TOOL_SELECTED_EVENT, setTool);
        return () => EventBus.off(TOOL_SELECTED_EVENT, setTool);
    }, []);

    return (
        <div className="tools-container">
            <ToolSidebar current={tool} />
            <SidePanelHost/>
        </div>
    );
}
