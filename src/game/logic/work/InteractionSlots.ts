import { Entity } from "../../ECS";

export interface Slot {
  x: number;
  y: number;
  occupiedBy: Entity | null;
}

export enum SlotLayout {
  RADIAL = "radial",
  GRID = "grid"
}

export class InteractionSlots {
  public slots: Slot[];

  constructor(
    public layout: SlotLayout,
    public radius: number,
    public count: number
  ) {
    this.slots = createSlots(layout, radius, count);
  }

  reserve(entity: Entity): { x: number; y: number } | null {
    for (const slot of this.slots) {
      if (slot.occupiedBy === null) {
        slot.occupiedBy = entity;
        return { x: slot.x, y: slot.y };
      }
    }
    return null;
  }

  release(entity: Entity): void {
    for (const slot of this.slots) {
      if (slot.occupiedBy === entity) {
        slot.occupiedBy = null;
      }
    }
  }
}

function createSlots(layout: SlotLayout, radius: number, count: number): Slot[] {
  const slots: Slot[] = [];

  if (layout === SlotLayout.RADIAL) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      slots.push({
        x: Math.round(Math.cos(angle) * radius),
        y: Math.round(Math.sin(angle) * radius),
        occupiedBy: null
      });
    }
  } else if (layout === SlotLayout.GRID) {
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = radius;
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      slots.push({
        x: Math.round((col - gridSize / 2) * spacing),
        y: Math.round((row - gridSize / 2) * spacing),
        occupiedBy: null
      });
    }
  }

  return slots;
}
