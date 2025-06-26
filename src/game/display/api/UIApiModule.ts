// src/game/logic/api/UIApiModule.ts

import { GameDisplayContext } from "../../display/GameDisplay";
import { DisplayModule } from "../../display/setup/DisplayModule";
import { PanelApi } from "./PanelApi";
import { ScheduleApi } from "./ScheduleApi";
import { SelectionApi } from "./SelectionApi";
import { SelectionHighlightApi } from "./SelectionHighlightApi";

export type ApiModule = DisplayModule<GameDisplayContext>;

/**
 * The UIApiModule acts as a facade, managing the lifecycle of all other ApiModules.
 * It does not contain any logic itself; it only initializes, updates, and destroys
 * its collection of self-contained sub-modules.
 */
export class UIApiModule extends DisplayModule<GameDisplayContext> {
    private apis: ApiModule[] = [
        new PanelApi(),
        new SelectionHighlightApi(),
        new SelectionApi(),
        new ScheduleApi(),
    ];

    /**
     * Initializes the facade, which in turn instantiates and initializes all
     * concrete ApiModule implementations.
     * @param context The shared game display context.
     */
    public init(context: GameDisplayContext): void {
        // Initialize each ApiModule, passing the necessary context.
        for (const api of this.apis) {
            api.init(context);
        }
    }

    /**
     * Propagates the update call to all managed ApiModules.
     * @param delta Time since the last frame.
     */
    public update(delta: number): void {
        for (const api of this.apis) {
            api.update(delta);
        }
    }

    /**
     * Propagates the destroy call to all managed ApiModules, ensuring
     * they unsubscribe from all events.
     */
    public destroy(): void {
        for (const api of this.apis) {
            api.destroy();
        }
        this.apis = [];
    }
}
