export const fs = /* cpp */ `
#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;
uniform vec3 floorColor;
uniform vec3 cameraPosition;
uniform vec3 lookAt;
uniform float cameraAngle;

// #define AA 2
#define AA 1
#define ITERATION 64 // 256
#define opU(d1, d2) d1.x < d2.x ? d1 : d2
#define opI(d1, d2) d1.x > d2.x ? d1 : d2
#define opS(d1, d2) d1.x > -d2.x ? d1 : vec2(-d2.x, d2.y);
#define min3(a, b, c) min(a, min(b, c))
#define max3(a, b, c) max(a, max(b, c))
#define grid(x) 1. - step(-.005, mod(x + .0025, .1)) * step(mod(x + .0025, .1), .005)

vec2 EPS = vec2(.00001, 0.0);
float backgroundIndex = -1.;
float boxFrameIndex = 1.;
float functionIndex = 2.;
float planeIndex = 3.;

float sdBox(vec3 p, vec3 b) {
        vec3 q = abs(p) - b;
        return length(max(q, 0.)) + min(max(q.x,max(q.y, q.z)), 0.);
}

float sdBoxFrame( vec3 p, vec3 b, float e) {
             p = abs(p)     - b;
        vec3 q = abs(p + e) - e;
        return min3(
                length(max(vec3(p.x, q.y, q.z) ,0.)) + min(max3(p.x, q.y, q.z), 0.),
                length(max(vec3(q.x, p.y, q.z) ,0.)) + min(max3(q.x, p.y, q.z), 0.),
                length(max(vec3(q.x, q.y, p.z), 0.)) + min(max3(q.x, q.y, p.z), 0.)
        );
}

float sdPlane(vec3 p) {
        return dot(p, vec3(1., 1., 0.));
}

float evalFunction(vec3 p) {
        return p.x * p.x + p.z * p.z - 1.0;
}

float sdF(vec3 p, float thickness) {
        float f = evalFunction(p);
        return min(abs(p.y - f) - thickness, 30.);
}

float sdF2(vec3 p, float thickness) {
        vec3 bs = vec3(1., 1., 1.);
        float res = sdBox(p, bs);
        res = max(res, sdF(p, thickness));
        return res;
}

vec2 map(vec3 pos) {
        vec2 res = vec2(100., backgroundIndex);
        res = opU(res, vec2(sdBoxFrame(pos, vec3(1.), .001), boxFrameIndex));
        res = opU(res, vec2(sdF2(pos, .0125), functionIndex));
        return res;
}

vec3 normal(vec3 pos) {
        float dx = map(pos + EPS.xyy).x - map(pos - EPS.xyy).x;
        float dy = map(pos + EPS.yxy).x - map(pos - EPS.yxy).x;
        float dz = map(pos + EPS.yyx).x - map(pos - EPS.yyx).x;
        return normalize(vec3(dx, dy, dz));
}

vec2 raymarch(vec3 ro, vec3 rd) {
        // raymarch primitives
        vec2 res = vec2(-1., backgroundIndex);
        float t = 0.;
        for (int i = 0; i < ITERATION; i++) {
                vec2 h = map(ro + rd * t);
                if (abs(h.x) < (EPS.x * t)) { res = vec2(t, h.y); break; }
                t += h.x * 0.42; // 0.5;
        }
        return res;
}

vec3 render(vec3 ro, vec3 rd) {
        vec2 res = raymarch(ro, rd);

        if (res.y < 0.) return floorColor;

        vec3 pos = ro + res.x * rd;
        vec3 nor = normal(pos);
        vec3 col = vec3(2.);
        if (res.y < 1.5)
                col = vec3(0.);
        else if (res.y < 2.5) {
                col = mix(colorB, colorA, abs(nor.x));
                col = mix(col, colorC, nor.z);
                col *= grid(pos.x);
                col *= grid(pos.z);
                col = vec3(dot(col, vec3(0., 0., 1)));
        }

        return col;
}

mat3 setCamera(vec3 ro, vec3 ta, float cr) {
        vec3 cw = normalize(ta - ro);
        vec3 cp = normalize(vec3(sin(cr), cos(cr), 0.0));
        vec3 cu = normalize( cross(cw, cp) );
        vec3 cv =          ( cross(cu, cw) );
        return mat3(cu, cv, cw);
}

out vec4 outColor;

void main() {
        // Setup viewport coordinates: -0.5, -0.5 to 0.5, 0.5
        float maxAxis = max(iResolution.x, iResolution.y);
        vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / maxAxis;

        // Define camera position
        vec3 ta = lookAt;
        vec3 ro = cameraPosition;
        mat3 ca = setCamera(ro, ta, cameraAngle);

        // Focal length
        const float fl = 2.25;

        // Antialiasing rendering loop
        vec3 col = vec3(0.0);
        vec2 off = vec2(0.5 / (maxAxis * float(AA)), 0.5 / (maxAxis * float(AA)));
        for (int m = 0; m < AA; m++)
        for (int n = 0; n < AA; n++) {
                float xx = p.x + float(m) * off.x;
                float yy = p.y + float(n) * off.y;
                vec3 rd = ca * normalize(vec3(vec2(xx, yy), fl));
                col += render(ro, rd);
        }
        col /= float(AA * AA);

        outColor = vec4(col, 1.0);
}
`.trim()

export const vs = /* ts */ `
#version 300 es
in vec4 a_position;
void main() {
        gl_Position = a_position;
}
`.trim()
