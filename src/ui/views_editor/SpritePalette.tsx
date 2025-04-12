import React from 'react';
import { PaletteEntry } from './PaletteEntry';
import './SpritePalette.css';
import {SpriteKey, SpriteLibrary} from "../../game/display/views_editor/SpriteLibrary.ts";

export const SpritePalette: React.FC = () => {
    return (
        <div className="sprite-palette">
            {Object.keys(SpriteLibrary).map((key) => (
                <PaletteEntry key={key} spriteKey={key as SpriteKey} />
            ))}
        </div>
    );
};
