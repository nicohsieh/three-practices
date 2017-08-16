uniform float mode;
uniform float time;
uniform vec3 point;
uniform float strength;

varying vec2 vXy;
varying float colorMut1;
varying float colorMut2;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
	vXy = vec2(position);
	colorMut1 = 0.;
	colorMut2 = 0.;

	vec3 newPos = vec3(position);

	if (mode == 0.0) {
		newPos.x += sin(time + position.y * 0.1) * .6;
		newPos.y += sin(time + position.x * 0.1) * 1.;

		float dist = 6. - distance(newPos, point) + mix(0., 3., strength) * 2.7;
	 
		float size = smoothstep(0., 13., dist);
		newPos.z += (size - 0.6) * 13.;

		colorMut1 = size * sin(time);
		colorMut2 = size * cos(time * 1.2 + 0.3);

		gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
		gl_PointSize = 3.;

	} else if (mode == 1.0) {
		newPos.x += sin(time + position.y * 0.1) * .6 * mod(newPos.y, 10.);
		newPos.y += sin(time + position.x * 0.1) * 1. + sin( abs(newPos.y / 10.) + 0.2);
		newPos.z += sin(time * 0.4 + position.x * 0.1) * 5.;

		float dist = 20. - distance(newPos, point);
	
		gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
		gl_PointSize = 2.;

	} else if (mode == 2.0) {

		newPos.x += sin(time + position.y * 0.1) * .6;
		newPos.y += sin(time + position.x * 0.1) * 1.;

		float dist = distance(newPos, point);
		vec3 xyDir = normalize(newPos - point);

		float amt = 1. - smoothstep(0., 40. + strength * 15., dist);
		float poweredAmt = pow(amt, 3.) * strength;
		newPos.x += xyDir.x * poweredAmt * noise(vec3(newPos.x * 20., position.x * 3., time * 0.3)) * 7.;
		newPos.y += xyDir.y * poweredAmt * noise(vec3(newPos.y * 15., position.y * 5., time * 0.3)) * 7.;
	
		colorMut1 = amt * sin(time);
		colorMut2 = amt * cos(time * 1.2 + 0.3);

		if (strength > 3.0) {
			newPos.z += amt * (strength - 3.) * 25.;
		}
		
		gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
		gl_PointSize = 2.;
	}
}