// src/ui/common/NeedTypes.ts (example path)

export enum NeedType {
    SLEEP = "Sleep",
    FOOD = "Hunger",
    FUN = "Fun",
}

export interface NeedDisplayInfo {
    label: string;
    defaultFillColor: string;
}

export const needDisplayInfoMap: Record<NeedType, NeedDisplayInfo> = {
    [NeedType.SLEEP]: { label: "Sleep", defaultFillColor: "#3498DB" },
    [NeedType.FOOD]: { label: "Food", defaultFillColor: "#E67E22" },
    [NeedType.FUN]: { label: "Fun", defaultFillColor: "#2ECC71" },
};

// Utility function to format the change rate
export const formatChangeRate = (rate: number): string => {
    if (rate === 0) return "0/hr";
    return `${rate > 0 ? "+" : rate < 0 ? "-" : ""}${rate}/hr`;
};
