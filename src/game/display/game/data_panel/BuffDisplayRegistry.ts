import { BuffType } from "../../../logic/buffs/buffsData";

export interface BuffDisplayInfo {
    isBuff: boolean;
    displayName: string;
    iconAssetKey: string;
    description: string;
}

export const BuffDisplayRegistry: Partial<Record<BuffType, BuffDisplayInfo>> = {
    [BuffType.RESTED]: {
        displayName: "Rested",
        iconAssetKey: "assets/icons/sleep_icon.png", // Ensure this asset exists
        description: "Feeling refreshed! +10% to walking and work speed.",
        isBuff: true,
    }
    // Add display information for other BuffTypes as they are created and need UI representation.
};