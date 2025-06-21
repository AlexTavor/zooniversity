import { useState, useEffect } from "react";
import { GameState } from "../../../game/logic/serialization/GameState.ts";
import { saveManager } from "../../../game/save_manager/SaveManager.ts";

export function useSaveManager() {
    const [current, setCurrent] = useState<GameState | undefined>();

    useEffect(() => {
        const loaded = saveManager.load();
        if (loaded) setCurrent(loaded);
    }, []);

    return { current };
}
