import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getSelectedSpriteKey, setSelectedSpriteKey } from "../../../game/display/editor/common/PaletteState.ts";
import { SpriteKey } from "../../../game/display/setup/SpriteLibrary.ts";
import { SpritePalette } from "../../shared/sprite_palette/SpritePalette.tsx";

interface SpritesPaletteProps {
    spriteKeys: SpriteKey[];
    onSelectedKeyChange?: (key: SpriteKey) => void;
}

export const SpritesPalette: React.FC<SpritesPaletteProps> = ({ spriteKeys, onSelectedKeyChange }) => {
    const [selectedKey, setLocalKey] = useState<SpriteKey | null>(getSelectedSpriteKey());

    const handleSelect = useCallback((key: SpriteKey) => {
        setSelectedSpriteKey(key);
        setLocalKey(key);
    }, []);

    useEffect(() => {
        setLocalKey(getSelectedSpriteKey());
    }, []);

    const memoizedKeys = useMemo(() => spriteKeys, [spriteKeys]);

    useEffect(() => {
        selectedKey && onSelectedKeyChange?.(selectedKey);
    }, [selectedKey]);

    return (
        <SpritePalette
            spriteKeys={memoizedKeys}
            selectedKey={selectedKey ?? ''}
            onSelect={handleSelect}
        />
    );
};
