// tint.frag
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform vec4 uTimeTint;      // RGBA tint
uniform float uCloudAlpha;   // 0.0 = full shadow, 1.0 = no darkening
uniform sampler2D uLightSampler; // Optional: greyscale lighting mask
uniform bool uUseLighting;

varying vec2 outTexCoord;

void main() {
    vec4 baseColor = texture2D(uMainSampler, outTexCoord);

    vec4 tint = vec4(uTimeTint.rgb, 1.0);

    // Optional lighting mask
    float lightFactor = 1.0;
    if (uUseLighting) {
        vec2 screenUV = gl_FragCoord.xy / uResolution;
        lightFactor = texture2D(uLightSampler, screenUV).r;
    }

    float cloudFactor = uCloudAlpha;

    vec3 final = baseColor.rgb * tint.rgb * cloudFactor * lightFactor;

    gl_FragColor = vec4(final, baseColor.a);
}
