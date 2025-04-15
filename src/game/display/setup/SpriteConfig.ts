import {Pos} from "../../../../utils/Math.ts";
import {SpriteKey} from "./SpriteLibrary.ts";

export interface SpriteConfig {
    id: string; // unique identifier for each instance
    key: SpriteKey; // refers to template
    position: Pos;
    size: Pos;
}