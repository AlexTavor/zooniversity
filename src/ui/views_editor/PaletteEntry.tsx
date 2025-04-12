import React from 'react';
import {SpriteKey, SpriteLibrary} from "../../game/display/views_editor/SpriteLibrary.ts";
import {usePhaserDragManager} from "./usePhaserDragManager.ts";


interface Props {
    spriteKey: SpriteKey;
}

export const PaletteEntry: React.FC<Props> = ({ spriteKey }) => {
    const dragManager = usePhaserDragManager();
    const def = SpriteLibrary[spriteKey];

    const handleMouseDown = () => {
        dragManager.startDrag({ spriteKey, source: 'palette' });
    };

    const imageSrc = def.path ?? `assets/${spriteKey}.png`;

    return (
        <div className="palette-entry" onMouseDown={handleMouseDown}>
            <img src={imageSrc} alt={spriteKey} draggable={false} />
        </div>
    );
};