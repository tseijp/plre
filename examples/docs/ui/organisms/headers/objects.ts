export const boxFrame = (key = '') => /* CPP */ `
#include "lygia/sdf/boxFrameSDF.glsl"
#define boxFrameSize vec3(1.0)
#define boxFrameThickness 0.1
float ${key}(vec3 pos) {
  return boxFrameSDF(pos, boxFrameSize, boxFrameThickness);
}
`

export const box = (key = '') => /* CPP */ `
#include "lygia/sdf/boxSDF.glsl"
#define boxSize vec3(1.0)
float ${key}(vec3 pos) {
  return boxSDF(pos, boxSize);
}
`

export const capsule = (key = '') => /* CPP */ `
#include "lygia/sdf/capsuleSDF.glsl"
#define capsuleSizeA vec3(1.0)
#define capsuleSizeB vec3(1.0)
#define capsuleRadius 0.1
float ${key}(vec3 pos) {
  return capsuleSDF(pos, capsuleSizeA, capsuleSizeB, capsuleRadius);
}
`

export const cone = (key = '') => /* CPP */ `
#include "lygia/sdf/coneSDF.glsl"
#define coneSize vec2(1.0)
#define coneRadius 0.1
float ${key}(vec3 pos) {
  return coneSDF(pos, coneSize, coneRadius);
}
`

export const cube = (key = '') => /* CPP */ `
#include "lygia/sdf/cubeSDF.glsl"
#define cubeSize vec3(1.0)
float ${key}(vec3 pos) {
  return cubeSDF(pos, cubeSize);
}
`

export const cylinder = (key = '') => /* CPP */ `
#include "lygia/sdf/cylinderSDF.glsl"
#define cylinderSizeA vec3(1.0)
#define cylinderSizeB vec3(1.0)
#define cylinderRadius 0.1
float ${key}(vec3 pos) {
  return cylinderSDF(pos, cylinderSizeA, cylinderSizeB, cylinderRadius);
}
`

export const dodecahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/dodecahedronSDF.glsl"
#define dodecahedronRadius 1.0
float ${key}(vec3 pos) {
  return dodecahedronSDF(pos, dodecahedronRadius);
}
`

export const ellipsoid = (key = '') => /* CPP */ `
#include "lygia/sdf/ellipsoidSDF.glsl"
#define ellipsoidRadius vec3(1.0)
float ${key}(vec3 pos) {
  return ellipsoidSDF(pos, ellipsoidRadius);
}
`

export const formula = (key = '') => /* CPP */ `
#define formulaThickness .05

float yourFormula(vec3 p) {
        // return p.x * p.x + p.z * p.z - 1.0;
        float sigma = .3;
        float a = p.x * p.x + p.z * p.z;
        float b = -.5 * a / (sigma * sigma);
        float c = sigma * sqrt(2. * PI);
        return 1. / c * exp(b) - 1.;
}
float ${key}(vec3 p) {
        float f = yourFormula(p);
        return min(abs(p.y - f) - formulaThickness, 30.);
}
`

export const hexPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/hexPrismSDF.glsl"
#define hexPrismHeight 0.1
float ${key}(vec3 pos) {
  return hexPrismSDF(pos, hexPrismSize, hexPrismHeight);
}
`

export const icosahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/icosahedronSDF.glsl"
#define icosahedronRadius 1.0
float ${key}(vec3 pos) {
  return icosahedronSDF(pos, icosahedronRadius);
}
`

export const link = (key = '') => /* CPP */ `
#include "lygia/sdf/linkSDF.glsl"
#define linkLength vec3(1.0)
#define linkRadius1 vec3(1.0)
#define linkRadius2 vec3(1.0)
float ${key}(vec3 pos) {
  return linkSDF(pos, linkLength, linkRadius1, linkRadius2);
}
`

export const octahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/octahedronSDF.glsl"
#define octahedronSize 1.0
float ${key}(vec3 pos) {
  return octahedronSDF(pos, octahedronSize);
}
`

export const octogonPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/octogonPrismSDF.glsl"
#define octogonPrismRadius 1.0
#define octogonPrismHeight 0.1
float ${key}(vec3 pos) {
  return octogonPrismSDF(pos, octogonPrismRadius, octogonPrismHeight);
}
`

export const plane = (key = '') => /* CPP */ `
#include "lygia/sdf/planeSDF.glsl"
#define planeSize vec3(1.0)
float ${key}(vec3 pos) {
  return planeSDF(pos);
}
`

export const pylamid = (key = '') => /* CPP */ `
#include "lygia/sdf/pylamidSDF.glsl"
#define pylamidHeight 0.1
float ${key}(vec3 pos) {
  return pylamidSDF(pos, pylamidHeight);
}
`

export const sphere = (key = '') => /* CPP */ `
#include "lygia/sdf/sphereSDF.glsl"
#define sphereSize 1.0
float ${key}(vec3 pos) {
  return sphereSDF(pos, sphereSize);
}
`

export const tetraheron = (key = '') => /* CPP */ `
#include "lygia/sdf/tetraheronSDF.glsl"
#define tetraheronHeight 1.0
float ${key}(vec3 pos) {
  return tetraheronSDF(pos, tetraheronHeight);
}
`

export const torus = (key = '') => /* CPP */ `
#include "lygia/sdf/torusSDF.glsl"
#define torusSize vec2(1.0)
#define torusRadiusA 0.1
#define torusRadiusB 0.1
float ${key}(vec3 pos) {
  return torusSDF(pos, torusSize, torusRadiusA, torusRadiusB);
}
`

export const triPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/triPrismSDF.glsl"
#define triPrismHeight 0.1
float ${key}(vec3 pos) {
  return triPrismSDF(pos, triPrismSize, triPrismHeight);
}
`
