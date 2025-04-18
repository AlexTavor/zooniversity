import {lerpColor} from "../../../../utils/Color.ts";

export const DEFAULT_DAY_GRADIENT: [number, number][] = [
    [0.0, 0x0a0a2a],   // midnight
    [0.15, 0xffcc88],  // sunrise
    [0.3, 0x99ccff],   // day
    [0.55, 0xff9966],  // sunset
    [0.7, 0x222244],   // dusk
    [1.0, 0x0a0a2a],   // back to night
];

export function getColorForMinute(
    minute: number,
    total: number,
    gradient: [number, number][]
): number {
    const t = (minute % total) / total;

    for (let i = 0; i < gradient.length - 1; i++) {
        const [t1, c1] = gradient[i];
        const [t2, c2] = gradient[i + 1];

        if (t >= t1 && t <= t2) {
            const factor = (t - t1) / (t2 - t1);
            return lerpColor(c1, c2, factor);
        }
    }

    return gradient[0][1]; // fallback
}
