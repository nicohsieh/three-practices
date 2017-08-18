precision mediump float;
uniform sampler2D texture;
uniform float size;
varying vec2 vXy;
varying float colorMut1;
varying float colorMut2;
varying float colorMut3;

void main() {
	vec2 pos = vXy * vec2( 1., 2.) * size + vec2( 0.5, 0.5);
	vec4 color = texture2D(texture, pos);
	color.r += abs(colorMut1 * 0.6);
	color.b += colorMut2 * 0.5;
	color.g += colorMut3;

	gl_FragColor = color;
}