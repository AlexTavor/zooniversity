import { Pos, MathUtils } from "../../../../../utils/Math";
import { Entity, ECS } from "../../../../ECS";
import { Transform } from "../../../../components/Transform";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { TimeComponent } from "../../../time/TimeComponent";
import { Tree } from "../../../trees/Tree";
import { ActionIntentComponent } from "../ActionIntentComponent";
import { StrollComponent } from "../relaxation/StrollComponent";
import { CharacterAction, ActionDataType, WalkingData, StrollingAtPointData, isWalkingData, CharacterIntent } from "../actionIntentData";

const STROLL_BEHIND_TREE_OFFSET = 30;
const MAX_CANDIDATE_TREES_FOR_RANDOM_STROLL = 5;
const MIN_PAUSE_DURATION_GAME_MINUTES = 2; // e.g., 2 game minutes
const MAX_PAUSE_DURATION_GAME_MINUTES = 5; // e.g., 5 game minutes

function setIdle(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.NONE;
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setRelaxing(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.RELAXING;
    aic.actionData = null;
}

function setWalkingToStrollPoint(aic: ActionIntentComponent, targetPosition: Pos, treeId?: Entity): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition,
        ultimateTargetEntityId: treeId
    } as WalkingData;
}

function setStrollingAtPoint(aic: ActionIntentComponent, treeId: Entity): void {
    aic.currentPerformedAction = CharacterAction.STROLLING;
    aic.actionData = {
        type: ActionDataType.StrollingAtPointData,
        atTreeEntityId: treeId
    } as StrollingAtPointData;
}

function findValidStrollTrees(ecs: ECS, excludeTreeId?: Entity): { id: Entity, transform: Transform }[] {
    const treeEntities = ecs.getEntitiesWithComponents([Tree, Transform]);
    const validTrees: { id: Entity, transform: Transform }[] = [];
    for (const treeId of treeEntities) {
        if (treeId === excludeTreeId) continue;
        validTrees.push({ id: treeId, transform: ecs.getComponent(treeId, Transform) });
    }
    return validTrees;
}

function selectNextStrollTarget(
    ecs: ECS,
    currentPosOrReferenceTransform: Transform,
    referenceTransformForOrientation: Transform,
    lastTargetTreeId?: Entity
): { treeId: Entity, strollTargetPos: Pos } | null {
    const availableTrees = findValidStrollTrees(ecs, lastTargetTreeId);
    if (availableTrees.length === 0) return null;

    const candidates = availableTrees.map(t => ({
        id: t.id,
        transform: t.transform,
        distSq: MathUtils.distance(currentPosOrReferenceTransform, t.transform) ** 2
    })).sort((a, b) => a.distSq - b.distSq);

    if (candidates.length === 0) return null;
    const selectionPool = candidates.slice(0, MAX_CANDIDATE_TREES_FOR_RANDOM_STROLL);
    const chosenTreeInfo = selectionPool[Math.floor(Math.random() * selectionPool.length)];
    
    const strollTargetPos = calculateBehindTreePosition(chosenTreeInfo.transform, referenceTransformForOrientation);
    return { treeId: chosenTreeInfo.id, strollTargetPos };
}

function calculateBehindTreePosition(treePos: Pos, referencePos: Pos): Pos {
    const dirVector = MathUtils.normalize(MathUtils.subtract(treePos, referencePos));
    if (dirVector.x === 0 && dirVector.y === 0) {
        return { x: treePos.x + STROLL_BEHIND_TREE_OFFSET, y: treePos.y };
    }
    return MathUtils.add(treePos, MathUtils.multiply(dirVector, STROLL_BEHIND_TREE_OFFSET));
}

export function handleRestIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
    // deltaTimeMs is removed
): void {
    const locomotion = ecs.getComponent(entity, LocomotionComponent);
    const strollComp = ecs.getComponent(entity, StrollComponent);
    const characterTransform = ecs.getComponent(entity, Transform);

    if (!locomotion || !characterTransform) return setIdle(actionIntent);
    if (!strollComp) return setRelaxing(actionIntent);

    const worldTimeEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
    if (!worldTimeEntity) return setRelaxing(actionIntent); // Cannot manage pause without time
    const time = ecs.getComponent(worldTimeEntity, TimeComponent);
    const currentGameTime = time.minutesElapsed;

    if (strollComp.isPausedAtTarget) {
        if (currentGameTime >= strollComp.pauseUntilTime) {
            strollComp.isPausedAtTarget = false;
            strollComp.lastTargetTreeId = strollComp.currentTargetTreeId;
            strollComp.currentTargetTreeId = undefined;
            strollComp.currentPathTargetPos = undefined;
        } else {
            if (strollComp.currentTargetTreeId) {
                setStrollingAtPoint(actionIntent, strollComp.currentTargetTreeId);
            } else { 
                setRelaxing(actionIntent);
            }
            return;
        }
    }

    if (!strollComp.currentPathTargetPos || !strollComp.currentTargetTreeId) {
        const referenceTransform = ecs.getComponent(strollComp.referencePointEntityId, Transform);
        if (!referenceTransform) {
            ecs.removeComponent(entity, StrollComponent);
            return setRelaxing(actionIntent);
        }
        
        const lastTreePosSource = strollComp.lastTargetTreeId ? ecs.getComponent(strollComp.lastTargetTreeId, Transform) : referenceTransform;
        const nextTargetInfo = selectNextStrollTarget(ecs, lastTreePosSource, referenceTransform, strollComp.lastTargetTreeId);

        if (nextTargetInfo) {
            strollComp.currentTargetTreeId = nextTargetInfo.treeId;
            strollComp.currentPathTargetPos = nextTargetInfo.strollTargetPos;
            actionIntent.actionData = null;
        } else {
            ecs.removeComponent(entity, StrollComponent);
            return setRelaxing(actionIntent);
        }
    }
    
    // We're still walking
    if (!locomotion.arrived) {
        const currentWalkData = actionIntent.actionData as WalkingData | null;
        if (actionIntent.currentPerformedAction !== CharacterAction.WALKING ||
            !isWalkingData(currentWalkData) ||
            currentWalkData.ultimateTargetEntityId !== strollComp.currentTargetTreeId) {
            
            setWalkingToStrollPoint(actionIntent, strollComp.currentPathTargetPos!, strollComp.currentTargetTreeId);
        }

        return;
    } 
    
    // We've arrived, waiting around
    if (actionIntent.currentPerformedAction != CharacterAction.STROLLING) {
        setStrollingAtPoint(actionIntent, strollComp.currentTargetTreeId!);
        strollComp.isPausedAtTarget = true;
        const pauseDuration = Math.random() * (MAX_PAUSE_DURATION_GAME_MINUTES - MIN_PAUSE_DURATION_GAME_MINUTES) + MIN_PAUSE_DURATION_GAME_MINUTES;
        strollComp.pauseUntilTime = currentGameTime + pauseDuration;
    }

    if (strollComp.pauseUntilTime >= currentGameTime){
        setWalkingToStrollPoint(actionIntent, {x:0,y:0});
    }
}