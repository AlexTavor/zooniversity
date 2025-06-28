import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { EventBus } from "../../../game/EventBus.ts";
import { GameEvent } from "../../../game/consts/GameEvent.ts";
import { ModalType } from "../modals/ModalManager.tsx";

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

const StyledPrototypeButton = styled.button`
  font-family: 'Chewy';
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: red;
  background-color: transparent;
  border: 0.4vmin dashed red;
  padding: 1.5vmin 3vmin;
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

export const PrototypeButton: React.FC = () => {
    const handleClick = () => {
        EventBus.emit(GameEvent.ShowModal, {
            type: ModalType.ProjectStatus,
        });
    };

    return (
        <StyledPrototypeButton onClick={handleClick}>
            PROTOTYPE (incomplete)
        </StyledPrototypeButton>
    );
};