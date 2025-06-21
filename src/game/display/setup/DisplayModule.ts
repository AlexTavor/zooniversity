import { ViewTracker } from "./ViewTracker.ts";
import { GameDisplayContext } from "../GameDisplay.ts";

export abstract class DisplayModule<T> {
    public abstract init(
        display: T,
        trackers?: Array<(context: GameDisplayContext) => ViewTracker>,
    ): void;
    public abstract update(delta: number): void;
    public abstract destroy(): void;
}
