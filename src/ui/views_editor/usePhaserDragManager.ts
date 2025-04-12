import { useMemo } from 'react';
import {getDragManager} from "../../game/display/views_editor/DragManagerRef.ts";

export const usePhaserDragManager = () => {
    return useMemo(() => getDragManager(), []);
};
