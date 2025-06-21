export namespace WeatherConfig {
    const timeMultiplier = 10000;
    const freq = 0.0005 / timeMultiplier;

    // Wind behavior
    export const Wind = {
        StrengthFrequency: freq, // How fast wind strength changes (lower = slower)
        DirectionFrequency: 0.00000005, // How often direction noise updates
        DirectionThreshold: 0, // Threshold for flipping direction (uses noise > 0)
        Bias: 0.3, // 0 = favor calm, 1 = favor wind, 0.5 = uniform,
        MinSpeed: 100, // Minimum wind speed
        MaxSpeed: 1000, // Maximum wind speed
    };

    // Cloud cover behavior
    export const CloudCover = {
        Frequency: freq, // How fast cloud cover changes
        NoiseOffset: 5000, // Offset for sampling different noise axis
        MinAlpha: 0, // Minimum cloud alpha (when cover is low)
        MaxAlpha: 1.0, // Maximum cloud alpha (full cover)
        Bias: 0, //  0 = usually clear, 1 = usually cloudy
    };
}
