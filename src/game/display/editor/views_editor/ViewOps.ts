import { ViewDefinition } from '../../setup/ViewDefinition';

export function findParentId(childId: number, viewMap: Record<number, ViewDefinition>): number | undefined {
    for (const [id, view] of Object.entries(viewMap)) {
        if (view.subViews.includes(childId)) return Number(id);
    }
    return undefined;
}
