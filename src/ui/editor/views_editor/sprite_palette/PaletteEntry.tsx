import React from 'react';
import {SpriteKey, SpriteLibrary} from "../../../../game/display/views_editor/SpriteLibrary.ts";

interface Props {
    spriteKey: SpriteKey;
    selected: boolean;
    onClick: () => void;
}

export const PaletteEntry: React.FC<Props> = ({ spriteKey, selected, onClick }) => {
    const def = SpriteLibrary[spriteKey];
    
    const imageSrc = def.path ?? `assets/${spriteKey}.png`;

    return (
        <button className={`palette-entry ${selected ? 'selected' : ''}`} onClick={onClick}>
            <img src={imageSrc} alt={spriteKey} draggable={false} />
        </button>
    );
};