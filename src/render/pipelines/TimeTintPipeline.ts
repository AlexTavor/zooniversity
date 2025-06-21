// TimeTintPipeline.ts
import Phaser from "phaser";
import fragShader from "../../shaders/tint.frag?raw";

export class TimeTintPipeline extends Phaser.Renderer.WebGL.Pipelines
    .SinglePipeline {
    constructor(game: Phaser.Game) {
        super({
            game,
            fragShader,
        });
    }

    setTintColor(color: Phaser.Display.Color) {
        this.set4f("uTimeTint", color.redGL, color.greenGL, color.blueGL, 1.0);
    }

    setCloudAlpha(alpha: number) {
        this.set1f("uCloudAlpha", Phaser.Math.Clamp(alpha, 0, 1));
    }

    setResolution(width: number, height: number) {
        this.set2f("uResolution", width, height);
    }

    setLightingTexture(rt: Phaser.GameObjects.RenderTexture | null) {
        const glTex = (rt as any)?._renderer?.glTexture;

        if (glTex) {
            this.setBoolean("uUseLighting", true);
            this.setTexture2D(glTex);
        } else {
            this.setBoolean("uUseLighting", false);
        }
    }
}
