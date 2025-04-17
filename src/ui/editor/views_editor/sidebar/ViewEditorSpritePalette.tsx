// @ts-ignore
import React, { useEffect, useState } from 'react';
import {SpritePalette} from "../../../shared/sprite_palette/SpritePalette.tsx";
import {getSelectedSpriteKey, setSelectedSpriteKey} from "../../../../game/display/editor/common/PaletteState.ts";
import {SpriteKey, SpriteLibrary} from "../../../../game/display/setup/SpriteLibrary.ts";

export function ViewEditorSpritePalette() {
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
        <SpritePalette
            spriteKeys={spriteKeys}
            selectedKey={selectedKey ?? ''}
            onSelect={handleClick}
        />
    );
}
