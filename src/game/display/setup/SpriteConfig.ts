import {SpriteKey} from "./SpriteLibrary.ts";
import {Pos} from "../../../utils/Math.ts";

export interface SpriteConfig {
    id: string; // unique identifier for each instance
    key: SpriteKey; // refers to template
    position: Pos;
    size: Pos;
}