// FILE: src/plugins/OutlinePlugin.ts

import Phaser from "phaser";

const GetValue = Phaser.Utils.Objects.GetValue;

// ===================================================================
//  1. THE PIPELINE CLASS (THE EFFECT)
//  This class is a blueprint for the outline effect.
// ===================================================================
const PostFXPipeline = Phaser.Renderer.WebGL.Pipelines.PostFXPipeline;
const fragTemplate = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;
uniform sampler2D uMainSampler; 
varying vec2 outTexCoord;
uniform vec2 texSize;
uniform float thickness;
uniform vec3 outlineColor;
const float DOUBLE_PI = 3.14159265358979323846264 * 2.;
void main() {
  vec4 front = texture2D(uMainSampler, outTexCoord);
  if (thickness > 0.0) {
    vec2 mag = vec2(thickness/texSize.x, thickness/texSize.y);
    vec4 curColor;
    float maxAlpha = front.a;
    vec2 offset;
    for (float angle = 0.; angle < DOUBLE_PI; angle += #{angleStep}) {
        offset = vec2(mag.x * cos(angle), mag.y * sin(angle));        
        curColor = texture2D(uMainSampler, outTexCoord + offset);
        maxAlpha = max(maxAlpha, curColor.a);
    }
    vec3 resultColor = front.rgb + (outlineColor.rgb * (1. - front.a)) * maxAlpha;
    gl_FragColor = vec4(resultColor, maxAlpha);
  } else {
    gl_FragColor = front;
  }
}
`;
const GetFrag = (quality: number = 0.1): string => {
    const samples = Math.max(quality * 100, 1);
    const angleStep = ((Math.PI * 2) / samples).toFixed(7);
    return fragTemplate.replace(/#\{angleStep\}/g, angleStep);
};
class OutlinePostFxPipeline extends PostFXPipeline {
    public thickness: number;
    public outlineColor: Phaser.Display.Color;

    constructor(game: Phaser.Game) {
        super({
            game,
            fragShader: GetFrag(0.1),
        });
        this.thickness = 0;
        this.outlineColor = new Phaser.Display.Color();
    }
    onPreRender() {
        this.set1f("thickness", this.thickness);
        this.set3f(
            "outlineColor",
            this.outlineColor.redGL,
            this.outlineColor.greenGL,
            this.outlineColor.blueGL,
        );
        this.set2f("texSize", this.width, this.height);
    }
}

// ===================================================================
//  2. THE PLUGIN CLASS (THE MANAGER)
//  This class adds and removes the effect from sprites.
// ===================================================================
export default class OutlinePipelinePlugin extends Phaser.Plugins.BasePlugin {
    // A map to keep track of which sprite has which pipeline instance.
    private pipelines: Map<
        Phaser.GameObjects.GameObject,
        OutlinePostFxPipeline
    >;

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
        this.pipelines = new Map();
        // The constructor is now clean. No more registration attempts.
    }

    /**
     * Creates and adds a new outline pipeline instance to a game object.
     */
    add(
        gameObject: Phaser.GameObjects.GameObject,
        config?: { thickness?: number; outlineColor?: number },
    ): OutlinePostFxPipeline {
        this.remove(gameObject); // Remove previous instances to be safe.

        // Manually create a new instance of our pipeline.
        const pipelineInstance = new OutlinePostFxPipeline(this.game);

        (gameObject as any).setPostPipeline(OutlinePostFxPipeline);

        // Configure the new instance from the config object.
        pipelineInstance.thickness = GetValue(config!, "thickness", 3);
        const color = GetValue(config!, "outlineColor", 0xffffff);
        if (typeof color === "number") {
            pipelineInstance.outlineColor.setFromRGB(
                Phaser.Display.Color.IntegerToRGB(color),
            );
        }

        // Store and return the instance.
        this.pipelines.set(gameObject, pipelineInstance);
        return pipelineInstance;
    }

    /**
     * Removes the outline pipeline from a game object.
     */
    remove(gameObject: Phaser.GameObjects.GameObject): this {
        // Check if we have a stored pipeline for this object.
        if (this.pipelines.has(gameObject)) {
            const pipelineInstance = this.pipelines.get(gameObject);
            const pipelineController = (gameObject as any).post;

            if (pipelineController && pipelineInstance) {
                // Remove the specific instance.
                pipelineController.remove(pipelineInstance);
            }

            this.pipelines.delete(gameObject);
        }
        return this;
    }
}
