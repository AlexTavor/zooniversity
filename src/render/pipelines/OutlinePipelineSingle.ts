export class OutlineOnlyPipeline extends Phaser.Renderer.WebGL.Pipelines
    .SinglePipeline {
    constructor(game: Phaser.Game) {
        super({
            game,
            fragShader: `
          precision mediump float;
  
          uniform sampler2D uMainSampler;
          varying vec2 outTexCoord;
          uniform vec2 texSize;
          uniform vec4 outlineColor;
          uniform float thickness;
  
          void main() {
            float threshold = 0.1;
            float pixelAlpha = texture2D(uMainSampler, outTexCoord).a;
  
            if (pixelAlpha >= threshold) {
              discard;
            }
  
            vec2 offset = 1.0 / texSize;
            bool outline = false;
  
            // Hardcoded max loop range (e.g. -5 to 5)
            for (int x = -5; x <= 5; x++) {
              for (int y = -5; y <= 5; y++) {
                // convert to float
                vec2 delta = vec2(float(x), float(y));
  
                // circular mask
                if (length(delta) > thickness) continue;
  
                vec2 sampleUV = outTexCoord + delta * offset;
                float sampleAlpha = texture2D(uMainSampler, sampleUV).a;
  
                if (sampleAlpha > threshold) {
                  outline = true;
                }
              }
            }
  
            if (outline) {
              gl_FragColor = outlineColor;
            } else {
              discard;
            }
          }
        `,
        });
    }

    onPreRender() {
        this.set2f("texSize", this.renderer.width, this.renderer.height);
        this.set4f("outlineColor", 1.0, 1.0, 0.0, 1.0); // yellow
        this.set1f("thickness", 2.0); // customizable
    }
}
