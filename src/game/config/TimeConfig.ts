export class TimeConfig {
    static HoursPerDay = 9;
    static DaysPerSemester = 30;
    static MinutesPerHour = 60;

    // In real-world seconds, 1 hour of in-game time takes 1 minute IRL
    static RealSecondsPerHour = 60;

    static SpeedMultipliers = {
        paused: 0,
        normal: 1,
        fast: 12,
        veryfast: 60,
    } as const;
}
