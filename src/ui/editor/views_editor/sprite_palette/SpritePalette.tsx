import React, { useState, useEffect } from 'react';
import './SpritePalette.css';
import {SpriteKey, SpriteLibrary} from "../../../../game/display/views_editor/SpriteLibrary.ts";
import {getSelectedSpriteKey, setSelectedSpriteKey} from "../../../../game/display/setup/PaletteState.ts";
import {PaletteEntry} from "./PaletteEntry.tsx";

export const SpritePalette: React.FC = () => {
    const [selectedKey, setLocalKey] = useState<SpriteKey | null>(getSelectedSpriteKey());

    const handleClick = (key: SpriteKey) => {
        setSelectedSpriteKey(key);
        setLocalKey(key);
    };

    useEffect(() => {
        setLocalKey(getSelectedSpriteKey());
    }, []);

    const spriteKeys = Object.keys(SpriteLibrary) as SpriteKey[];

    return (
        <div className="sprite-palette">
            {spriteKeys.map((key) => (
                <PaletteEntry
                    key={key}
                    spriteKey={key}
                    selected={selectedKey === key}
                    onClick={() => handleClick(key)}
                />
            ))}
        </div>
    );
};
