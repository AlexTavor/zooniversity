import {lerpColor} from "../../../../utils/Color.ts";

export const SKY_TINT_GRADIENT: [number, number][] = [
    [0.0, 0x0a0a2a],   // midnight start (deep night)
    [0.375, 0xffcc88], // dawn (3h / 8h)
    [0.5, 0x99ccff],   // day (4h / 8h)
    [0.875, 0xff9966], // dusk (7h / 8h)
    [1.0, 0x0a0a2a],   // back to night
];

export const SPRITE_TINT_GRADIENT: [number, number][] = [
    [0.0, 0x334466],  // start of night
    [0.375, 0xfff2cc], // start of dawn (3h / 8h = 0.375)
    [0.5, 0xffffff],   // start of day (4h / 8h)
    [0.875, 0xfff2cc], // start of dusk (7h / 8h)
    [1.0, 0x334466],  // end of night (loop around)
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
