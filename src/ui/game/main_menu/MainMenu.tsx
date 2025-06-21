import { MenuButton } from "./MenuButton.tsx";
import { EventBus } from "../../../game/EventBus.ts";
import { GameEvent } from "../../../game/consts/GameEvent.ts";
import { useSaveManager } from "./useSaveManager.tsx";
import "./MainMenu.css";

export const MainMenu: React.FC = () => {
    const { current } = useSaveManager();

    return (
        <div className="main-menu">
            <img
                src="assets/splash.png"
                alt="Main Menu"
                className="menu-background"
            />
            <div className="menu-buttons">
                <MenuButton
                    title="NEW GAME"
                    onClick={() => EventBus.emit(GameEvent.NewGame)}
                />
                <MenuButton
                    title="CONTINUE"
                    onClick={() => EventBus.emit(GameEvent.LoadGame, current)}
                    enabled={!!current}
                />
                <MenuButton title="LOAD" onClick={() => {}} enabled={true} />
            </div>
        </div>
    );
};
