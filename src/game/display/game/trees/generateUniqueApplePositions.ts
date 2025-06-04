import { Pos } from "../../../../utils/Math";
import { Entity } from "../../../ECS";

function mulberry32(seed: number) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export function generateUniqueApplePositions(
    treeEntityId: Entity,
    maxApplesToDisplay: number,
    treeAppleClusterCenter: Pos = { x: 0, y: -130 }, 
    baseSpreadRadius: number = 100, 
    numInitialPointsToGenerate: number = 20, 
    minShiftFactor: number = 0,  // Min factor (0-1) to shift towards the calculated center
    maxShiftFactor: number = 0.4   // Max factor (0-1) to shift towards the calculated center
): Pos[] {
    if (maxApplesToDisplay === 0) {
        return [];
    }

    const random = mulberry32(treeEntityId);
    const generatedBasePoints: Pos[] = [];

    const actualNumInitialPoints = Math.max(maxApplesToDisplay, numInitialPointsToGenerate);

    for (let i = 0; i < actualNumInitialPoints; i++) {
        const angle = random() * 2 * Math.PI;
        const distance = random() * baseSpreadRadius;
        generatedBasePoints.push({
            x: treeAppleClusterCenter.x + Math.cos(angle) * distance,
            y: treeAppleClusterCenter.y + Math.sin(angle) * distance,
        });
    }

    if (generatedBasePoints.length === 0) return [];

    let sumX = 0;
    let sumY = 0;
    for (const p of generatedBasePoints) {
        sumX += p.x;
        sumY += p.y;
    }
    const calculatedCenterOfGeneratedPoints: Pos = {
        x: sumX / generatedBasePoints.length,
        y: sumY / generatedBasePoints.length,
    };

    // Shuffle the generated base points to pick from for the final display count
    const shuffledPoints = [...generatedBasePoints];
    for (let i = shuffledPoints.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffledPoints[i], shuffledPoints[j]] = [shuffledPoints[j], shuffledPoints[i]];
    }

    const finalPositions: Pos[] = [];
    const pointsToProcess = Math.min(shuffledPoints.length, maxApplesToDisplay);

    for (let i = 0; i < pointsToProcess; i++) {
        const basePosition = shuffledPoints[i];
        const deltaX = calculatedCenterOfGeneratedPoints.x - basePosition.x;
        const deltaY = calculatedCenterOfGeneratedPoints.y - basePosition.y;

        const shiftFactor = minShiftFactor + random() * (maxShiftFactor - minShiftFactor);

        const newX = basePosition.x + deltaX * shiftFactor;
        const newY = basePosition.y + deltaY * shiftFactor;

        finalPositions.push({ x: Math.round(newX), y: Math.round(newY) });
    }

    return finalPositions;
}