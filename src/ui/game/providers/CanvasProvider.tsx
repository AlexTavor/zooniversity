import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
} from "react";
import { EventBus } from "../../../game/EventBus";

// NOTE: Ensure this event name matches the one you are emitting from Game.ts
const CANVAS_RESIZED_EVENT = "canvas-resized";

/**
 * Defines the structure for the canvas bounds object.
 */
export interface CanvasBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * React Context to hold the canvas bounds. Initial value is null.
 */
const CanvasContext = createContext<CanvasBounds | null>(null);

interface CanvasProviderProps {
    children: ReactNode;
}

/**
 * A provider component that listens for canvas resize events from Phaser
 * and makes the canvas's current bounds available to all descendant components.
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
    const [bounds, setBounds] = useState<CanvasBounds | null>(null);

    useEffect(() => {
        const handleResize = (newBounds: CanvasBounds) => {
            setBounds(newBounds);
        };

        // Subscribe to the event emitted by Phaser
        EventBus.on(CANVAS_RESIZED_EVENT, handleResize);

        // Cleanup function to unsubscribe when the component unmounts
        return () => {
            EventBus.off(CANVAS_RESIZED_EVENT, handleResize);
        };
    }, []); // The empty dependency array ensures this effect runs only once.

    return (
        <CanvasContext.Provider value={bounds}>
            {children}
        </CanvasContext.Provider>
    );
};

/**
 * Custom hook for easy consumption of the canvas bounds context.
 * @returns The current CanvasBounds object, or null if not yet available.
 */
export const useCanvasBounds = () => {
    return useContext(CanvasContext);
};