import { Pos } from "../../../utils/Math";
import { View } from "../../display/setup/View";
import { ViewType } from "../../display/setup/ViewDefinition";

// Output: caveEntityId → sorted array of nearby tree entityIds
export function buildCaveTreeLUTFromViews(
    views: Map<number, View>,
): Record<number, number[]> {
    const caves: { id: number; pos: Pos }[] = [];
    const trees: { id: number; pos: Pos }[] = [];

    for (const [entity, view] of views) {
        if (view.type === ViewType.CAVE) {
            caves.push({ id: entity, pos: view.viewDefinition.position });
        } else if (view.type === ViewType.TREE) {
            trees.push({ id: entity, pos: view.viewDefinition.position });
        }
    }

    const result: Record<number, number[]> = {};

    for (const cave of caves) {
        const sortedTrees = trees
            .map((tree) => ({
                id: tree.id,
                distSq: distanceSq(cave.pos, tree.pos),
            }))
            .sort((a, b) => a.distSq - b.distSq)
            .map((t) => t.id);

        result[cave.id] = sortedTrees;
    }

    return result;
}

function distanceSq(a: Pos, b: Pos): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
}
