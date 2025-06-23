// FILE: src/render/shaders/outline.frag
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uTextureSize;
uniform float uThickness;
uniform vec4 uOutlineColor; // This will be white, set from your effect code

varying vec2 v_tex_coord;

void main(void) {
    vec2 uv = v_tex_coord;
    float alpha = texture2D(uMainSampler, uv).a;

    // If this pixel is inside the sprite, discard it.
    if (alpha > 0.5) {
        discard;
    }

    // Calculate the size of one pixel in texture coordinates.
    vec2 one_pixel = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);

    // Check the alpha of the 4 neighboring pixels.
    float neighbor_alpha_sum = 0.0;
    neighbor_alpha_sum += texture2D(uMainSampler, uv + one_pixel * vec2( uThickness,  0.0)).a; // Right
    neighbor_alpha_sum += texture2D(uMainSampler, uv - one_pixel * vec2( uThickness,  0.0)).a; // Left
    neighbor_alpha_sum += texture2D(uMainSampler, uv + one_pixel * vec2( 0.0,  uThickness)).a; // Down
    neighbor_alpha_sum += texture2D(uMainSampler, uv - one_pixel * vec2( 0.0,  uThickness)).a; // Up

    // If any neighbor is visible, this pixel must be part of the outline.
    if (neighbor_alpha_sum > 0.0) {
        gl_FragColor = uOutlineColor;
    } else {
        discard; // Otherwise, this pixel is empty space.
    }
}