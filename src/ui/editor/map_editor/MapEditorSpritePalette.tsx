import React, { useState, useEffect } from 'react';
import {getSelectedSpriteKey, setSelectedSpriteKey} from "../../../game/display/setup/PaletteState.ts";
import {SpritePalette} from "../../shared/sprite_palette/SpritePalette.tsx";
import {PlantSpriteKeys, SpriteKey} from "../../../game/display/setup/SpriteLibrary.ts";

const TREE_KEYS: SpriteKey[] = [...PlantSpriteKeys];

export function MapEditorSpritePalette() {
    const [selectedKey, setLocalKey] = useState<SpriteKey | null>(getSelectedSpriteKey());

    const handleClick = (key: SpriteKey) => {
        setSelectedSpriteKey(key);
        setLocalKey(key);
    };

    useEffect(() => {
        setLocalKey(getSelectedSpriteKey());
    }, []);

    return (
        <SpritePalette
            spriteKeys={TREE_KEYS}
            selectedKey={selectedKey ?? ''}
            onSelect={handleClick}
        />
    );
}
