import { createObject } from 'plre'
import { addMaterial } from 'plre/control'
import { ObjectTypes, PLObject } from 'plre/types'
import { addSuffix, attachParent, getLayerKey } from 'plre/utils'

export const addLandscape = (obj: PLObject, type: ObjectTypes) => {
        const child = createObject(type)
        obj.children.push(child)
        attachParent(obj)

        const key = getLayerKey(child)
        const ids = obj.children.map((c) => c.id)
        child.shader = landscapeObject(key).trim()
        child.id = addSuffix(ids, child.id)

        // optional
        const mat = addMaterial(child)
        const _key = getLayerKey(mat)
        mat.shader = landscapeMaterial(_key).trim()
        return child
}

export const landscapeObject = (key: string) => /* CPP */ `
#include "lygia/generative/noised.glsl"
#include "lygia/generative/gnoise.glsl"

#ifndef FBM9
#define FBM9 1
const mat2 m2 = mat2(.8, .6, -.6, .8);

float fbm_9(vec2 x) {
        float f = 2.;
        float s = .5;
        float a = 0.;
        float b = .5;
        for (int i = 0; i < 9; i++) {
                a += b * gnoise(x);
                b *= s;
                x = f * m2 * x;
        }
        return a;
}
#endif

uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 p = abs(pos);
  if (p.x > 1.) return 1.;
  if (p.y > 1.) return 1.;
  if (p.z > 1.) return 1.;
  float e = fbm_9(pos.xz) - .5;
  return pos.y - e;
}
`

export const landscapeMaterial = (key: string) => /* CPP */ `
vec3 ${key}(vec3 pos, vec3 nor) {
  vec3 light = vec3(.5);
  vec3 col = vec3(.18, .11, .08);
  return col * dot(nor, light) * 8.;
}
`
