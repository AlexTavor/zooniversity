import { BuffType } from "../../logic/buffs/buffsData";

export interface BuffDisplayInfo {
    isBuff: boolean;
    displayName: string;
    iconAssetKey: string;
    description: string;
}

export const BuffDisplayRegistry: Partial<Record<BuffType, BuffDisplayInfo>> = {
    [BuffType.RESTED]: {
        displayName: "Rested",
        iconAssetKey: "assets/icons/sleep_icon.png",
        description: "Feeling refreshed! +10% to walking and work speed.",
        isBuff: true,
    },
    [BuffType.TIRED]: {
        displayName: "Tired",
        iconAssetKey: "assets/icons/sleep_icon.png",
        description: "Tired! -25%% to walking and work speed.",
        isBuff: false,
    }
    // Add display information for other BuffTypes as they are created and need UI representation.
};