export class EditorEvent {
    public static readonly MapUpdated: string = "map-updated";
    public static readonly MapLoaded: string = "map-loaded";
    public static readonly PaletteTypeSelected: string =
        "palette-type-selected";
}

export enum PaletteType {
    none = "none",
    trees = "trees",
    caves = "caves",
}
