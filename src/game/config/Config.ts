import {AnimImportsConfig} from "./AnimImportsConfig.ts";
import {MapConfig} from "./MapConfig.ts";
import {Display} from "./Display.ts";
import {CameraConfig} from "./CameraConfig.ts";

export class Config {
    public static readonly Display:Display = new Display();
    public static readonly Map:MapConfig = new MapConfig();
    public static readonly AnimImports:AnimImportsConfig = new AnimImportsConfig();
    public static readonly Camera = new CameraConfig();
    public static readonly GameWidth = Config.AnimImports.StaticWidth*Config.Camera.MaxZoom;
    public static readonly GameHeight = Config.AnimImports.StaticHeight*Config.Camera.MaxZoom;
    public static readonly EntryScene = "ViewsEditor";
}