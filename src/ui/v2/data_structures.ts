import { Entity } from "../../game/ECS";
import { ToolType } from "../../game/display/game/tools/GameTools";
import { CharacterAction } from "../../game/logic/intent/intent-to-action/actionIntentData";
import { CharacterType } from "../../game/logic/characters/Character";
import { NeedType } from "./elements/needs/NeedTypes";

interface CharacterUIData {
    id: Entity;
    characterType: CharacterType;
    currentAction: CharacterAction;
    progress?: number;
}

interface ToolInfo {
    type: ToolType;
}

interface ToolsUIData {
    availableTools: ToolInfo[];
    activeTool: ToolType | null;
}

enum StatusEffectType { /* ... e.g., RESTED, HUNGRY, INSPIRED */ }
enum ScheduleActivityType { /* ... e.g., WORK, SLEEP, STUDY, FREE_TIME */ } // Corresponds to CharacterIntent

interface Thought {
    timestamp: number; // Or Date object, depending on how you want to format it
    message: string;
}

interface StatusEffectUIData {
    type: StatusEffectType; // UI uses this for icon lookup
    displayName: string; // For explicit display name if needed, separate from description
    descriptionTemplate: string; // e.g., "{0} to work speed"
    args: string[]; // e.g., ["+10%"]
    maxDuration?: number; // Optional: In-game minutes/seconds
    currentDuration?: number; // Optional: In-game minutes/seconds remaining
    isBuff: boolean; // True if buff, false if debuff, for styling
  }

interface CurrentActionUIData {
    type: CharacterAction; // UI uses this for icon lookup
    description: string; // e.g., "Chopping a sturdy oak tree"
}

interface ScheduleUIData {
    slots: ScheduleActivityType[]; // Array representing each hour/block of the day
    currentActivity: ScheduleActivityType; // The activity for the current time slot
    // currentIndex?: number; // Optional: if UI needs to highlight current slot
}

interface NeedUIData {
    type: NeedType;
    max: number;
    current: number;
    changeRatePerHour: number; // Can be positive or negative
    fillColor?: string;
    label:string;
}

interface SelectedCharacterUIData {
    id: Entity;
    name: string;
    currentStatusText: string; // Overall status summary, e.g., "Feeling tired but productive."
    thoughtsLog: Thought[];
    needs: NeedUIData[];
    statusEffects: StatusEffectUIData[];
    currentAction: CurrentActionUIData;
    schedule: ScheduleUIData;
    // characterType: CharacterType; // For portrait icon if not already available globally
}