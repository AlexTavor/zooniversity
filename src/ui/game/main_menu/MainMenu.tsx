import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { MenuButton } from "./MenuButton.tsx";
import { EventBus } from "../../../game/EventBus.ts";
import { GameEvent } from "../../../game/consts/GameEvent.ts";
import { useSaveManager } from "./useSaveManager.tsx";
import { ModalType } from "../modals/ModalManager.tsx";

// Keyframes for the pulsing animation
const pulse = keyframes`
  0% {
    transform: scale(1) rotate(-5deg);
  }
  5% {
    transform: scale(1.1) rotate(-5deg);
  }
  10% {
    transform: scale(1.1) rotate(-5deg);
  }
  15% {
    transform: scale(1) rotate(-5deg);
  }
  20% {
    transform: scale(1.05) rotate(-5deg);
  }
  25% {
    transform: scale(1) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(-5deg);
  }
`;

const MainMenuWrapper = styled.div`
    position: static;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const MenuBackground = styled.img`
    background: #000000 !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    z-index: 0;
    pointer-events: none;
`;

const MenuButtons = styled.div`
    position: absolute;
    bottom: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 32px;
    z-index: 10;
`;

const PrototypeButton = styled.button`
  font-family: 'Chewy';
  font-size: 4rem;
  color: red;
  background-color: transparent;
  border: 2px dashed red;
  padding: 8px 16px;
  cursor: pointer;
  position: absolute;
  top: 40%;
  right: 25%;
  transform: rotate(-5deg);
  animation: ${pulse} 2.5s infinite ease-in-out;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.3) rotate(-3deg);
    animation-play-state: paused;
  }
`;

export const MainMenu: React.FC = () => {
    const { current } = useSaveManager();

    const handlePrototypeClick = () => {
        EventBus.emit(GameEvent.ShowModal, {
            type:ModalType.ProjectStatus,
        });    
    };

    return (
        <MainMenuWrapper>
            <MenuBackground
                src="assets/splash.png"
                alt="Main Menu"
            />
            <PrototypeButton onClick={handlePrototypeClick}>
                PROTOTYPE (incomplete)
            </PrototypeButton>
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
        </MainMenuWrapper>
    );
};