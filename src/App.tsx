import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { UISwitcher } from "./ui/ui_switcher/UISwitcher.tsx";

export function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <div id="game-wrapper">
                <PhaserGame ref={phaserRef} />
                <UISwitcher />
            </div>
        </div>
    );
}
