import {GameState} from "../logic/serialization/GameState.ts";

const SAVE_KEY = "zooniversity_save";

export interface SaveManager {
    save(state: GameState): void;
    load(): GameState | null;
    clear(): void;
}

export const saveManager: SaveManager = {
    save(state) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    },
    load() {
        const raw = localStorage.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    clear() {
        localStorage.removeItem(SAVE_KEY);
    },
};
