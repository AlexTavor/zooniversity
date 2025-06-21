import { Entity, System } from "../../ECS";
import { InputComponent } from "../input/InputComponent.ts";
import { TimeComponent } from "./TimeComponent.ts";
import { TimeConfig } from "../../config/TimeConfig.ts";
import { EventBus } from "../../EventBus.ts";
import { GameEvent } from "../../consts/GameEvent.ts";

export class TimeSystem extends System {
    public componentsRequired = new Set<Function>([
        TimeComponent,
        InputComponent,
    ]);

    update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const time = this.ecs.getComponent(entity, TimeComponent);
            const input = this.ecs.getComponent(entity, InputComponent);

            const speedMultiplier = TimeConfig.SpeedMultipliers[input.speed];
            time.speedFactor = speedMultiplier;

            if (speedMultiplier === 0) continue;

            // Calculate how much real time has passed
            const realSecondsPassed = delta / 1000;
            const inGameHours =
                (realSecondsPassed / TimeConfig.RealSecondsPerHour) *
                speedMultiplier;
            const inGameMinutes = inGameHours * TimeConfig.MinutesPerHour;

            this.advanceTime(time, inGameMinutes);
        }
    }

    private advanceTime(time: TimeComponent, minutesToAdd: number) {
        time.minutesElapsed += minutesToAdd;
        time.minute += minutesToAdd;

        while (time.minute >= TimeConfig.MinutesPerHour) {
            time.minute -= TimeConfig.MinutesPerHour;
            time.hour += 1;
        }

        while (time.hour >= TimeConfig.HoursPerDay) {
            time.hour -= TimeConfig.HoursPerDay;
            time.day += 1;
        }

        while (time.day >= TimeConfig.DaysPerSemester) {
            time.day -= TimeConfig.DaysPerSemester;
            time.semester += 1;
        }

        EventBus.emit(GameEvent.SetTime, time.minutesElapsed);
    }
}
