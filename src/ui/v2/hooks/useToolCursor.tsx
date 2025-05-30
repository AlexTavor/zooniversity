// src/ui/hooks/useToolCursor.ts
import { useEffect } from 'react';
import { ToolType } from '../../../game/display/game/tools/GameTools'; 
import { useSelectedTool } from './useSelectedTool';

const PHASER_GAME_CONTAINER_ID = 'game-container';

export function useToolCursor(gameContainerId: string = PHASER_GAME_CONTAINER_ID): void {
  const selectedTool = useSelectedTool();

  useEffect(() => {
    const gameContainer = document.getElementById(gameContainerId);
    if (!gameContainer) {
      console.warn(`useToolCursor: Game container with ID "${gameContainerId}" not found.`);
      return;
    }

    const classesToRemove = ['game-cursor-default', 'game-cursor-tree-cutting'];
    // Add other cursor classes here if they exist

    gameContainer.classList.remove(...classesToRemove);

    switch (selectedTool) {
      case ToolType.TreeCutting:
        gameContainer.classList.add('game-cursor-tree-cutting');
        break;
      case ToolType.Selection:
      case ToolType.None:
      default:
        gameContainer.classList.add('game-cursor-default');
        break;
    }

    return () => {
      if (gameContainer) {
        gameContainer.classList.remove(...classesToRemove);
      }
    };
  }, [selectedTool, gameContainerId]);
}