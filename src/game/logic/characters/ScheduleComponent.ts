import { Component } from "../../ECS";
import { CharacterIntent } from "../intent/intent-to-action/actionIntentData";

export type ScheduleEntry = CharacterIntent; // One entry per hour

export class ScheduleComponent extends Component {
  public lastScheduleStartHour: number = 0; // Time in minutes when the schedule started

  constructor(public entries: ScheduleEntry[]) {
    super();
  }
}

export function createStandardSchedule(): ScheduleComponent {
  return new ScheduleComponent([
    CharacterIntent.SLEEP,
    CharacterIntent.HARVEST,
    CharacterIntent.FORAGE,
    CharacterIntent.FORAGE,
    CharacterIntent.REST,
    CharacterIntent.FORAGE,
    CharacterIntent.FORAGE,
    CharacterIntent.FORAGE,
    CharacterIntent.SLEEP
  ]);
}