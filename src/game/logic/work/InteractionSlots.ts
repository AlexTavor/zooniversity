import { Entity } from "../../ECS";

export enum SlotType {
    WORK = "work",
    SLEEP = "sleep"
}

export enum SlotLayout {
  RADIAL = "radial",
  GRID = "grid"
}

export interface Slot {
  x: number;
  y: number;
  occupiedBy: Entity | null;
}

interface BaseSlotDefinition {
  layout: SlotLayout;
  count: number;
}

interface RadialSlotDefinition extends BaseSlotDefinition {
  layout: SlotLayout.RADIAL;
  radius: number; // Distance from center for RADIAL layout
}

interface GridSlotDefinition extends BaseSlotDefinition {
  layout: SlotLayout.GRID;
  spacing: number; // Distance between slot centers for GRID layout
}

export type SlotDefinition = RadialSlotDefinition | GridSlotDefinition;

export class InteractionSlots {
  private slots: Map<SlotType, Slot[]> = new Map();

  constructor(definitions: Partial<Record<SlotType, SlotDefinition>>) {
    for (const [type, def] of Object.entries(definitions) as [SlotType, SlotDefinition][]) {
      if (def) { // Ensure def is not undefined if Record value can be optional
        this.slots.set(type, createSlots(def));
      }
    }
  }

  public reserve(entity: Entity, slotType: SlotType = SlotType.WORK): { x: number; y: number } | null {
    const group = this.slots.get(slotType);
    if (!group) return null;

    for (const slot of group) {
      if (slot.occupiedBy === null) {
        slot.occupiedBy = entity;
        return { x: slot.x, y: slot.y };
      }
    }
    return null;
  }

  public release(entity: Entity): void {
    for (const group of this.slots.values()) {
      for (const slot of group) {
        if (slot.occupiedBy === entity) {
          slot.occupiedBy = null;
        }
      }
    }
  }

  public getSlotsArray(type: SlotType): ReadonlyArray<Slot> {
    return this.slots.get(type) || [];
  }
}

function createSlots(definition: SlotDefinition): Slot[] {
  const slots: Slot[] = [];
  const { count } = definition;

  if (definition.layout === SlotLayout.RADIAL) {
    // radius is guaranteed to exist due to the RadialSlotDefinition type
    const { radius } = definition;
    if (count <= 0) return slots; // No slots to create

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      slots.push({
        x: Math.round(Math.cos(angle) * radius),
        y: Math.round(Math.sin(angle) * radius),
        occupiedBy: null
      });
    }
  } else if (definition.layout === SlotLayout.GRID) {
    // spacing is guaranteed to exist due to the GridSlotDefinition type
    const { spacing } = definition;
    if (count <= 0) return slots; // No slots to create

    const gridSize = Math.ceil(Math.sqrt(count));
    // This offset centers the grid around the local (0,0) point
    const offsetAmount = (gridSize - 1) / 2;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      slots.push({
        x: Math.round((col - offsetAmount) * spacing),
        y: Math.round((row - offsetAmount) * spacing),
        occupiedBy: null
      });
    }
  }
  return slots;
}