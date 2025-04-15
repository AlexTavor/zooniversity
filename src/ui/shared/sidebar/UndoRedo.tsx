import React from 'react';
import {EventBus} from "../../../../game/EventBus.ts";

export const UndoRedo: React.FC = () => {
    return (
        <div className="undo-redo-controls">
            <button onClick={() => EventBus.emit('editor-undo')}>↩ Undo</button>
            <button onClick={() => EventBus.emit('editor-redo')}>↪ Redo</button>
        </div>
    );
};
