import "./SpritePalette.css";
import { PaletteEntry } from "./PaletteEntry.tsx";
import { SpriteKey } from "../../../game/display/setup/SpriteLibrary.ts";

interface SpritePaletteProps {
    spriteKeys: string[];
    onSelect: (key: SpriteKey) => void;
    selectedKey?: string;
}

export function SpritePalette({
    spriteKeys,
    onSelect,
    selectedKey,
}: SpritePaletteProps) {
    return (
        <div className="sprite-palette">
            {spriteKeys.map((key) => (
                <PaletteEntry
                    key={key}
                    spriteKey={key as SpriteKey}
                    selected={selectedKey === key}
                    onClick={() => onSelect(key as SpriteKey)}
                />
            ))}
        </div>
    );
}
