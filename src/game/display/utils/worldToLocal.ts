import Phaser from "phaser";
import { Pos } from "../../../utils/Math.ts";

export function worldToLocal(
    container: Phaser.GameObjects.Container,
    worldPos: Pos,
): Pos {
    const matrix = container.getWorldTransformMatrix();
    const inverse = new Phaser.GameObjects.Components.TransformMatrix();
    matrix.copyToContext(inverse as any); // hacky but safe in Phaser 3
    inverse.invert();

    const out = new Phaser.Math.Vector2();
    inverse.transformPoint(worldPos.x, worldPos.y, out);
    return { x: out.x, y: out.y };
}
