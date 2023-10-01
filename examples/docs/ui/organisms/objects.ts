export const boxFrame = (key = '') => /* CPP */ `
#include "lygia/sdf/boxFrameSDF.glsl"
float ${key}(vec3 pos) {
  vec3 boxFrameSize = vec3(1.0);
  float boxFrameThickness = 0.1;
  return boxFrameSDF(pos, boxFrameSize, boxFrameThickness);
}
`

export const box = (key = '') => /* CPP */ `
#include "lygia/sdf/boxSDF.glsl"
float ${key}(vec3 pos) {
  vec3 boxSize = vec3(1.0);
  return boxSDF(pos, boxSize);
}
`

export const capsule = (key = '') => /* CPP */ `
#include "lygia/sdf/capsuleSDF.glsl"
float ${key}(vec3 pos) {
  vec3 capsuleA = vec3(0.0, -0.5, 0.0);
  vec3 capsuleB = vec3(0.0, 0.5, 0.0);
  float capsuleRadius = 1.0;
  return capsuleSDF(pos, capsuleA, capsuleB, capsuleRadius);
}
`

export const cone = (key = '') => /* CPP */ `
#include "lygia/sdf/coneSDF.glsl"
float ${key}(vec3 pos) {
  vec2 coneSize = vec2(1.0);
  float coneRadius = 1.0;
  return coneSDF(pos, coneSize, coneRadius);
}
`

export const cube = (key = '') => /* CPP */ `
#include "lygia/sdf/cubeSDF.glsl"
float ${key}(vec3 pos) {
  vec3 cubeSize = vec3(1.0);
  return cubeSDF(pos, cubeSize);
}
`

export const cylinder = (key = '') => /* CPP */ `
#include "lygia/sdf/cylinderSDF.glsl"
float ${key}(vec3 pos) {
  vec3 cylinderA = vec3(0.0, -1.0, 0.0);
  vec3 cylinderB = vec3(0.0, 1.0, 0.0);
  float cylinderRadius = 1.0;
  return cylinderSDF(pos, cylinderA, cylinderB, cylinderRadius);
}
`

export const dodecahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/dodecahedronSDF.glsl"
float ${key}(vec3 pos) {
  float dodecahedronRadius = 1.0;
  return dodecahedronSDF(pos, dodecahedronRadius);
}
`

export const ellipsoid = (key = '') => /* CPP */ `
#include "lygia/sdf/ellipsoidSDF.glsl"
float ${key}(vec3 pos) {
  vec3 ellipsoidRadius = vec3(0.5, 1.0, 0.5);
  return ellipsoidSDF(pos, ellipsoidRadius);
}
`

export const formula = (key = '') => /* CPP */ `
float ${key}(vec3 p) {
  float f = p.x * p.x + p.z * p.z - 1.0;
  float formulaThickness = .05;
  return min(abs(p.y - f) - formulaThickness, 30.);
}
`

export const hexPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/hexPrismSDF.glsl"
float ${key}(vec3 pos) {
  vec2 hexPrismSize = vec2(1.0);
  return hexPrismSDF(pos, hexPrismSize);
}
`

export const icosahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/icosahedronSDF.glsl"
float ${key}(vec3 pos) {
  float icosahedronRadius = 1.0;
  return icosahedronSDF(pos, icosahedronRadius);
}
`

export const link = (key = '') => /* CPP */ `
#include "lygia/sdf/linkSDF.glsl"
float ${key}(vec3 pos) {
  float linkLength = 0.5;
  float linkRadius1 = 0.5;
  float linkRadius2 = 0.1;
  return linkSDF(pos, linkLength, linkRadius1, linkRadius2);
}
`

export const octahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/octahedronSDF.glsl"
float ${key}(vec3 pos) {
  float octahedronSize = 1.0;
  return octahedronSDF(pos, octahedronSize);
}
`

export const octogonPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/octogonPrismSDF.glsl"
float ${key}(vec3 pos) {
  float octogonPrismRadius = 1.0;
  float octogonPrismHeight = 1.0;
  return octogonPrismSDF(pos, octogonPrismRadius, octogonPrismHeight);
}
`

export const plane = (key = '') => /* CPP */ `
#include "lygia/sdf/planeSDF.glsl"
float ${key}(vec3 pos) {
  vec3 planeSize = vec3(1.0);
  return planeSDF(pos);
}
`

export const pylamid = (key = '') => /* CPP */ `
#include "lygia/sdf/pyramidSDF.glsl"
float ${key}(vec3 pos) {
  float pyramidHeight = 1.0;
  return pyramidSDF(pos, pyramidHeight);
}
`

export const sphere = (key = '') => /* CPP */ `
#include "lygia/sdf/sphereSDF.glsl"
float ${key}(vec3 pos) {
  float sphereSize = 1.0;
  return sphereSDF(pos, sphereSize);
}
`

export const tetrahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/tetrahedronSDF.glsl"
float ${key}(vec3 pos) {
  float tetrahedronHeight = 1.0;
  return tetrahedronSDF(pos, tetrahedronHeight);
}
`

export const torus = (key = '') => /* CPP */ `
#include "lygia/sdf/torusSDF.glsl"
float ${key}(vec3 pos) {
  vec2 torusSize = vec2(1.0);
  float torusRadiusA = 1.0;
  float torusRadiusB = 1.0;
  return torusSDF(pos, torusSize, torusRadiusA, torusRadiusB);
}
`

export const triPrismSDF = (key = '') => /* CPP */ `
#include "lygia/sdf/triPrismSDF.glsl"
float ${key}(vec3 pos) {
  vec2 triPrismSize = vec2(1.0);
  return triPrismSDF(pos, triPrismSize);
}
`
