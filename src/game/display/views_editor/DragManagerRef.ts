import { DragManager } from './DragManager';

let dragManagerInstance: DragManager | null = null;

export const setDragManager = (instance: DragManager) => {
    dragManagerInstance = instance;
};

export const getDragManager = (): DragManager => {
    if (!dragManagerInstance) {
        throw new Error('DragManager has not been initialized.');
    }
    return dragManagerInstance;
};
