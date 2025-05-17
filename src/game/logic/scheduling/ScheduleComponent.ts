import { Component } from "../../ECS";
import { CharacterIntent } from "../action-intent/actionIntentData";

export type ScheduleEntry = CharacterIntent; // One entry per hour

export class ScheduleComponent extends Component {
  constructor(public entries: ScheduleEntry[]) {
    super();
  }
}

export function createStandardSchedule(): ScheduleComponent {
  return new ScheduleComponent([
    CharacterIntent.SLEEP,
    CharacterIntent.HARVEST,
    CharacterIntent.HARVEST,
    CharacterIntent.REST,
    CharacterIntent.HARVEST,
    CharacterIntent.HARVEST,
    CharacterIntent.HARVEST,
    CharacterIntent.SLEEP
  ]);
}