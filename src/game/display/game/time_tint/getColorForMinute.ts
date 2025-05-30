import {lerpColor} from "../../../../utils/Color.ts";

export const SKY_TINT_GRADIENT: [number, number][] = [
    [0.0, 0x0a0a2a],   // midnight
    [0.1, 0x0a0a2a],  // still night
    [0.2, 0xffcc88], // dawn
    [0.3, 0x99ccff], // day
    [0.5, 0x99ccff],   // full day
    [0.75, 0x99ccff],  // hold daylight
    [0.875, 0xff9966], // dusk
    [1.0, 0x0a0a2a],   // back to night
];

export const SPRITE_TINT_GRADIENT: [number, number][] = [
    [0.0, 0x4c5b88],   // deep night
    [0.1, 0x4c5b88],  // night holds
    [0.25, 0xfff2cc], // dawn
    [0.5, 0xffffff],   // full day
    [0.75, 0xffffff],  // hold day
    [0.875, 0xfff2cc], // dusk
    [1.0, 0x4c5b88],   // back to night
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
