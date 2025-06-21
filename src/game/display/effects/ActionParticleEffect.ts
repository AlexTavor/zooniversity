import { View } from "../setup/View";
import { EffectInstance } from "../setup/ViewEffectController";

export class ActionParticleEffect implements EffectInstance {
    private view: View;

    constructor(view: View) {
        this.view = view;
    }

    public start(): void {}

    public stop(): void {}

    public update(_delta: number): void {}
}
