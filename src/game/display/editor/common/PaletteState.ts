import {SpriteKey} from "../../setup/SpriteLibrary.ts";

let selectedSpriteKey: SpriteKey | null = null;

export function getSelectedSpriteKey(): SpriteKey | null {
    return selectedSpriteKey;
}

export function setSelectedSpriteKey(key: SpriteKey | null): void {
    selectedSpriteKey = key;
}
