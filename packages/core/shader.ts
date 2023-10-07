export const fs = /* cpp */ `#version 300 es
precision highp float;
uniform float cameraAngle;
uniform vec2 iResolution;
uniform vec3 cameraPosition;
uniform vec3 lookAt;
uniform vec3 floorColor;

#ifndef PI
#define PI 3.14159265359
#endif
#ifndef opU
#define opU(d1, d2) d1.x < d2.x ? d1 : d2
#endif
#ifndef opI
#define opI(d1, d2) d1.x > d2.x ? d1 : d2
#endif
#ifndef opS
#define opS(d1, d2) d1.x > -d2.x ? d1 : vec2(-d2.x, d2.y);
#endif
#ifndef TRANSFORM
#define TRANSFORM(m, p) pos = (m * vec4(p, 1.)).xyz
#endif
#ifndef NORMAL
#define NORMAL(F, p) (\
  normalize(vec3( \
    F(p + EPS.xyy) - F(p - EPS.xyy),\
    F(p + EPS.yxy) - F(p - EPS.yxy),\
    F(p + EPS.yyx) - F(p - EPS.yyx) \
  ))\
)
#endif

const vec2 EPS = vec2(.00001, 0.0);
const vec2 MAX = vec2( 9999, -1);
const vec2 MIN = vec2(-9999, -1);

#include <PLRE_SHADER>
vec3 normal(vec3 pos) {
        float dx = map(pos + EPS.xyy).x - map(pos - EPS.xyy).x;
        float dy = map(pos + EPS.yxy).x - map(pos - EPS.yxy).x;
        float dz = map(pos + EPS.yyx).x - map(pos - EPS.yyx).x;
        return normalize(vec3(dx, dy, dz));
}

#ifndef ITERATION
#define ITERATION 256 // 64
#endif

vec2 raymarch(vec3 ro, vec3 rd) {
        // raymarch primitives
        vec2 res = vec2(9999, -1.);
        float t = 0.;
        for (int i = 0; i < ITERATION; i++) {
                vec2 h = map(ro + rd * t);
                if (abs(h.x) < (EPS.x * t)) { res = vec2(t, h.y); break; }
                t += h.x * 0.42; // 0.5;
        }
        return res;
}
#include <PLRE_RENDER>
mat3 setCamera(vec3 ro, vec3 ta, float cr) {
        vec3 cw = normalize(ta - ro);
        vec3 cp = normalize(vec3(sin(cr), cos(cr), 0.0));
        vec3 cu = normalize( cross(cw, cp) );
        vec3 cv =          ( cross(cu, cw) );
        return mat3(cu, cv, cw);
}

out vec4 outColor;

// Focal length
const float fl = 2.25;

#ifndef AA
#define AA 1
// #define AA 2
#endif

void main() {
        // Setup viewport coordinates: -0.5, -0.5 to 0.5, 0.5
        float maxAxis = max(iResolution.x, iResolution.y);
        vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / maxAxis;

        // Define camera position
        vec3 ta = lookAt;
        vec3 ro = cameraPosition;
        mat3 ca = setCamera(ro, ta, cameraAngle);

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
