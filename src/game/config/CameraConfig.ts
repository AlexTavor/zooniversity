export class CameraConfig {
    public readonly MaxTimeBetweenClicksMs: number = 200;
    public readonly MaxZoom: number = 8;
    public readonly MinZoom: number = 0.14;
    public readonly DefaultZoom: number = 1;
    public readonly DragDamping: number = 0.95;
    public readonly InertiaThreshold: number = 0.05;
    public readonly ZoomDurationMs: number = 300;
    public readonly PanDurationMs: number = 300;
    public readonly WheelZoomFactorIncrement: number = 1.5;
    public readonly WheelZoomFactorDecrement: number = 0.5;
    public readonly BackgroundColor: number = 0x0000ff;
    public readonly PanEasing: string = 'Linear';
}