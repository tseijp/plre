export const boxFrame = (key = '') => /* CPP */ `
#include "lygia/sdf/boxFrameSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 boxFrameSize = vec3(1.);
  float boxFrameThickness = .1;
  return boxFrameSDF(pos, boxFrameSize, boxFrameThickness);
}
`

export const box = (key = '') => /* CPP */ `
#include "lygia/sdf/boxSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 boxSize = vec3(1.);
  return boxSDF(pos, boxSize);
}
`

export const capsule = (key = '') => /* CPP */ `
#include "lygia/sdf/capsuleSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 capsuleA = vec3(0., -.5, 0.);
  vec3 capsuleB = vec3(0., .5, 0.);
  float capsuleRadius = 1.;
  return capsuleSDF(pos, capsuleA, capsuleB, capsuleRadius);
}
`

export const cone = (key = '') => /* CPP */ `
#include "lygia/sdf/coneSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec2 coneSize = vec2(1.);
  float coneRadius = 1.;
  return coneSDF(pos, coneSize, coneRadius);
}
`

export const cylinder = (key = '') => /* CPP */ `
#include "lygia/sdf/cylinderSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 cylinderA = vec3(0., -1., 0.);
  vec3 cylinderB = vec3(0., 1., 0.);
  float cylinderRadius = 1.;
  return cylinderSDF(pos, cylinderA, cylinderB, cylinderRadius);
}
`

export const dodecahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/dodecahedronSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float dodecahedronRadius = 1.;
  return dodecahedronSDF(pos, dodecahedronRadius);
}
`

export const ellipsoid = (key = '') => /* CPP */ `
#include "lygia/sdf/ellipsoidSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 ellipsoidRadius = vec3(.5, 1., .5);
  return ellipsoidSDF(pos, ellipsoidRadius);
}
`

export const formula = (key = '') => /* CPP */ `
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float f = pos.x * pos.x + pos.z * pos.z - 1.;
  return min(abs(pos.y - f) - .5, 30.);
}
`

export const hexPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/hexPrismSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec2 hexPrismSize = vec2(1.);
  return hexPrismSDF(pos, hexPrismSize);
}
`

export const icosahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/icosahedronSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float icosahedronRadius = 1.;
  return icosahedronSDF(pos, icosahedronRadius);
}
`

export const link = (key = '') => /* CPP */ `
#include "lygia/sdf/linkSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float linkLength = .5;
  float linkRadius1 = .5;
  float linkRadius2 = .1;
  return linkSDF(pos, linkLength, linkRadius1, linkRadius2);
}
`

export const octahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/octahedronSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float octahedronSize = 1.;
  return octahedronSDF(pos, octahedronSize);
}
`

export const octogonPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/octogonPrismSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float octogonPrismRadius = 1.;
  float octogonPrismHeight = 1.;
  return octogonPrismSDF(pos, octogonPrismRadius, octogonPrismHeight);
}
`

export const plane = (key = '') => /* CPP */ `
#include "lygia/sdf/planeSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 planeSize = vec3(1.);
  return planeSDF(pos);
}
`

export const pyramid = (key = '') => /* CPP */ `
#include "lygia/sdf/pyramidSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float pyramidHeight = 1.;
  return pyramidSDF(pos, pyramidHeight);
}
`

export const sphere = (key = '') => /* CPP */ `
#include "lygia/sdf/sphereSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float sphereSize = 1.;
  return sphereSDF(pos, sphereSize);
}
`

export const tetrahedron = (key = '') => /* CPP */ `
#include "lygia/sdf/tetrahedronSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float tetrahedronHeight = 1.;
  return tetrahedronSDF(pos, tetrahedronHeight);
}
`

export const torus = (key = '') => /* CPP */ `
#include "lygia/sdf/torusSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec2 torusSize = vec2(1.);
  float torusRadiusA = 1.;
  float torusRadiusB = 1.;
  return torusSDF(pos, torusSize, torusRadiusA, torusRadiusB);
}
`

export const triPrism = (key = '') => /* CPP */ `
#include "lygia/sdf/triPrismSDF.glsl"
uniform mat4 ${key}_M;
float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec2 triPrismSize = vec2(1.);
  return triPrismSDF(pos, triPrismSize);
}
`
