export const tetrahedron = (key: string) => /* CPP */ `
#ifndef ITERATIONS
#define ITERATIONS 8
#endif
float ${key}_DE(vec3 p, vec3 offset, float scale) {
  vec4 z = vec4(p, 1.);
  for (int i = 0; i < ITERATIONS; i++) {
    if (z.x + z.y < 0.) z.xy = -z.yx;
    if (z.x + z.z < 0.) z.xz = -z.zx;
    if (z.y + z.z < 0.) z.zy = -z.yz;
    z *= scale;
    z.xyz -= offset * (scale - 1.);
  }
  return (length(z.xyz) - 1.5) / z.w;
}

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  return ${key}_DE(pos, vec3(1. - iMouse.y), 2. - iMouse.x);
}
`

export const mengerSponge = (key: string) => /* CPP */ `
// ref: https://qiita.com/aa_debdeb/items/bffe5b7a33f5bf65d25b
// https://gam0022.net/blog/2019/06/25/unity-raymarching/
#ifndef ITERATIONS
#define ITERATIONS 8
#endif
float ${key}_DE(vec3 p, vec3 offset, float scale) {
  vec4 z = vec4(p, 1.);
  for (int i = 0; i < ITERATIONS; i++) {
    z = abs(z);
    if (z.x < z.y) z.xy = z.yx;
    if (z.x < z.z) z.xz = z.zx;
    if (z.y < z.z) z.yz = z.zy;
    z *= scale;
    z.xyz -= offset * (scale - 1.);
    if (z.z < -.5 * offset.z * (scale - 1.))
      z.z += offset.z * (scale - 1.);
  }
  return (length(max(abs(z.xyz) - vec3(1.), 0.))) / z.w;
}

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  return ${key}_DE(pos, vec3(1.), 3. - 1. * iMouse.x);
}
`

export const mandelbulb = (key: string) => /* CPP */ `
// ref: https://qiita.com/aa_debdeb/items/bffe5b7a33f5bf65d25b
#ifndef ITERATIONS
#define ITERATIONS 8
#endif
float ${key}_DE(vec3 p, float power) {
  vec3 z = p;
  float dr = 1.;
  float r;
  for (int i = 0; i < ITERATIONS; i++) {
    r = length(z);
    if (r > 10.) break;
    float theta = acos(z.y / r);
    float phi = atan(z.z, z.x);
    dr = pow(r, power - 1.) * power * dr + 1.;
    float zr = pow(r, power);
    theta = theta * power;
    phi = phi * power;
    z = zr * vec3(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
    z += p;
  }
  return .5 * log(r) * r / dr - .1 * iMouse.y;
}

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  return ${key}_DE(pos, 8. - 8. * iMouse.x);
}
`

export const quaternionMandelbrot = (key: string) => /* CPP */ `
// ref: https://qiita.com/aa_debdeb/items/bffe5b7a33f5bf65d25b
#ifndef ITERATIONS
#define ITERATIONS 8
#endif
${defineQuaternion}
float ${key}_DE(vec4 p) {
  vec4 z, dz, pz, pdz;
  float r, dr;
  for (int i = 0; i < ITERATIONS; i++) {
    pz = z;
    z = qmul(pz, pz) + p;
    pdz = dz;
    dz = 2. * (1. - length(iMouse)) * qmul(pz, pdz) + 1.;
    r = length(z + iMouse.x * .5);
    dr = length(dz * (1. - iMouse.y * .5));
    if (r > 2.)  break;
  }
  return 0.5 * log(r) * r / dr;
}

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  return ${key}_DE(vec4(pos - vec3(.5, 0., 0.), 0.));
}
`

export const quaternionJuliaSet = (key: string) => /* CPP */ `
// ref: https://qiita.com/aa_debdeb/items/bffe5b7a33f5bf65d25b
#ifndef ITERATIONS
#define ITERATIONS 8
#endif
${defineQuaternion}
float ${key}_DE(vec4 p, vec4 c) {
  vec4 z = p;
  vec4 dz = vec4(1.);
  vec4 pz, pdz;
  float r, dr;
  for (int i = 0; i < ITERATIONS; i++) {
    pz = z;
    z = qmul(pz, pz) + c;
    pdz = dz;
    dz = (2. - length(iMouse + .2)) * qmul(pz, pdz);
    r = length(z);
    dr = length(dz * (1. - iMouse.y * .5));
    if (r > 2.) break;
  }
  return .5 * log(r) * r / dr;
}

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  return ${key}_DE(vec4(pos, 0.), vec4(-1., -.2 * (1. - iMouse.x) , 0., 0.));
}
`

export const quaternionSet = (key: string) => /* CPP */ `
// ref: https://qiita.com/aa_debdeb/items/bffe5b7a33f5bf65d25b
#ifndef ITERATIONS
#define ITERATIONS 8
#endif
${defineQuaternion}
#include "lygia/generative/snoise.glsl"
float ${key}_DE(vec4 p, vec4 c) {
  vec4 z = p;
  vec4 dz = vec4(1.);
  vec4 pz, pdz;
  float r, dr;
  for (int i = 0; i < ITERATIONS; i++) {
    pz = z;
    z = qmul(pz, pz) + c + snoise(p * (1. + length(iMouse)));
    pdz = dz;
    dz = (2. - length(iMouse + .2)) * qmul(pz, pdz);
    r = length(z);
    dr = length(dz * (1. - iMouse.y * .5));
    if (r > 2.) break;
  }
  return .5 * log(r) * r / dr;
}

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  return ${key}_DE(vec4(pos, 0.), vec4(-1., -.2 * (1. - iMouse.x) , 0., 0.));
}
`

/**
 * utils
 */
const defineQuaternion = /* CPP */ `
#ifndef qmul
#define qmul(a, b) vec4( \
  a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w, \
  a.x * b.y + a.y * b.x - a.z * b.w + a.w * b.z, \
  a.x * b.z + a.y * b.w + a.z * b.x - a.w * b.y, \
  a.x * b.w - a.y * b.z + a.z * b.y + a.w * b.x \
)
#endif
`
