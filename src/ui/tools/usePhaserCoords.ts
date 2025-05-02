import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EventBus } from '../../game/EventBus';
import { Pos } from '../../utils/Math';
import { GameEvent } from '../../game/consts/GameEvent';

interface InitEventData {
  game?: Phaser.Game;
  scene?: Phaser.Scene;
}

interface TrackEventData {
  worldX: number;
  worldY: number;
  camera: Phaser.Cameras.Scene2D.Camera;
}

const useWorldToParentCoords = (): Pos | null => {
  const [relativeCoords, setRelativeCoords] = useState<Pos | null>(null);
  const [isGameReady, setIsGameReady] = useState(false);

  const latestWorldCoords = useRef<Pos | null>(null);
  const latestCamera = useRef<Phaser.Cameras.Scene2D.Camera | null>(null);
  const eventEmitterRef = useRef<Phaser.Events.EventEmitter | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const handleGameInit = (data: InitEventData) => {
      console.log('GameEvents.Init received');
      if (data.game) {
        eventEmitterRef.current = data.game.events;
      } else if (data.scene) {
        eventEmitterRef.current = data.scene.events;
      } else {
        console.warn('Could not determine event emitter from GameEvents.Init');
        eventEmitterRef.current = EventBus;
      }

      if (isMounted.current) {
        setIsGameReady(true);
      }
    };

    EventBus?.on(GameEvent.InitGame, handleGameInit);
    return () => {
      EventBus?.off(GameEvent.InitGame, handleGameInit);
    };
  }, []);

  const calculateRelativeCoords = useCallback(() => {
    const worldCoords = latestWorldCoords.current;
    const camera = latestCamera.current;

    if (!worldCoords || !camera) {
      if (isMounted.current) setRelativeCoords(null);
      return;
    }

    const worldPoint = new Phaser.Math.Vector2(worldCoords.x, worldCoords.y);
    const screenPoint = new Phaser.Math.Vector2();
    camera.matrix.transformPoint(worldPoint.x, worldPoint.y, screenPoint);

    if (isMounted.current) {
      setRelativeCoords((prevCoords) => {
        if (prevCoords?.x !== screenPoint.x || prevCoords?.y !== screenPoint.y) {
          return { x: screenPoint.x, y: screenPoint.y };
        }
        return prevCoords;
      });
    }
  }, []);

  useEffect(() => {
    const eventEmitter = eventEmitterRef.current;
    if (!isGameReady || !eventEmitter) return;

    const handleTrackPosition = (data: TrackEventData) => {
      latestWorldCoords.current = { x: data.worldX, y: data.worldY };
      latestCamera.current = data.camera;
      calculateRelativeCoords();
    };

    const handleStopTracking = () => {
      latestWorldCoords.current = null;
      latestCamera.current = null;
      if (isMounted.current) setRelativeCoords(null);
    };

    eventEmitter.on('trackObjectPosition', handleTrackPosition);
    eventEmitter.on('stopTrackingPosition', handleStopTracking);

    return () => {
      eventEmitter.off('trackObjectPosition', handleTrackPosition);
      eventEmitter.off('stopTrackingPosition', handleStopTracking);
    };
  }, [isGameReady, calculateRelativeCoords]);

  return relativeCoords;
};

export default useWorldToParentCoords;
