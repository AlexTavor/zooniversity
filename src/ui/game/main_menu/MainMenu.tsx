import React from "react";
import styled from "@emotion/styled";
import { MenuButton } from "./MenuButton.tsx";
import { EventBus } from "../../../game/EventBus.ts";
import { GameEvent } from "../../../game/consts/GameEvent.ts";
import { useSaveManager } from "./useSaveManager.tsx";
import { PrototypeButton } from "./PrototypeButton.tsx";

const MainMenuWrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageContainer = styled.div`
    position: relative;
    line-height: 0;
`;

const MenuBackground = styled.img`
    display: block;
    max-width: 100vw;
    max-height: 100vh;
    width: auto;
    height: auto;
    pointer-events: none;
`;

const MenuButtons = styled.div`
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    display: flex;
    justify-content: center;
    gap: 2vw;
    z-index: 10;
`;

export const MainMenu: React.FC = () => {
    const { current } = useSaveManager();

    return (
        <MainMenuWrapper>
            <ImageContainer>
                <MenuBackground
                    src="assets/splash.png"
                    alt="Main Menu"
                />
                <PrototypeButton/>
                <MenuButtons>
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
                </MenuButtons>
            </ImageContainer>
        </MainMenuWrapper>
    );
};