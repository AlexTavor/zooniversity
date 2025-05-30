import { useEffect, useState } from "react";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";
import { ToolType } from "../../../game/display/game/tools/GameTools";

export function useSelectedTool(): ToolType | null {
    const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);

    useEffect(() => {
        const handle = (tool: ToolType) => {
            setSelectedTool(tool)
        };

        EventBus.on(GameEvent.ToolSelected, handle);
        return () => {
            EventBus.off(GameEvent.ToolSelected, handle);
        };
    }, []);

    return selectedTool;
}
