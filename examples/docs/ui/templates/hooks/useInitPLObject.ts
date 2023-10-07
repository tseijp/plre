import { createObject } from 'plre'
import { getLayerKey, withoutMat } from 'plre/utils'
import { compile } from 'plre/compile'
import { useOnce } from '../../atoms'

const boxSDF = (key = '') => /* CPP */ `
uniform mat4 ${key}_M;

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  vec3 boxSize = vec3(1.);
  vec3 d = abs(pos) - boxSize;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}
`

const boxFrameSDF = (key = '') => /* CPP */ `
uniform mat4 ${key}_M;

#ifndef min3
#define min3(a, b, c) min(a, min(b, c))
#define max3(a, b, c) max(a, max(b, c))
#endif

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float boxFrameThickness = .001;
  vec3 boxFrameSize = vec3(1.);
  vec3 p = abs(pos) - boxFrameSize;
  vec3 q = abs(p + boxFrameThickness) - boxFrameThickness;
  return min3(
    length(max(vec3(p.x, q.y, q.z) ,0.)) + min(max3(p.x, q.y, q.z), 0.),
    length(max(vec3(q.x, p.y, q.z) ,0.)) + min(max3(q.x, p.y, q.z), 0.),
    length(max(vec3(q.x, q.y, p.z), 0.)) + min(max3(q.x, q.y, p.z), 0.)
  );
}
`

const formulaSDF = (key = '') => /* CPP */ `
uniform mat4 ${key}_M;

float ${key}_Formula(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  // return pos.x * pos.x + pos.z * pos.z - 1.0;
  float sigma = .3;
  float a = pos.x * pos.x + pos.z * pos.z;
  float b = -.5 * a / (sigma * sigma);
  float c = sigma * sqrt(2. * PI);
  return 1. / c * exp(b) - 1.;
}

float ${key}(vec3 pos) {
  TRANSFORM(${key}_M, pos);
  float f = ${key}_Formula(pos);
  float formulaThickness = .05;
  return min(abs(pos.y - f) - formulaThickness, 30.);
}
`

const gridMaterial = (key = '') => /* CPP */ `
#ifndef grid
#define grid(x) 1. - step(-.005, mod(x + .0025, .1)) * step(mod(x + .0025, .1), .005)
#endif
vec3 ${key}(vec3 pos, vec3 nor) {
  vec3 light = normalize(vec3(0., 0., 1));
  vec3 col = vec3(dot(nor, light)) * 0.5 + 0.5;
  col *= grid(pos.x);
  col *= grid(pos.z);
  return col;
}
`

export const createInitPLObject = () => {
        // X^2 + y^2 formula
        const M1 = createObject('Material', { id: 'Material' })
        const formula = createObject('formula', { children: [M1] })
        const M2 = createObject('Material', { id: 'Material' })
        const box = createObject('box', { color: null, children: [M2] })
        const I = createObject('I', { children: [formula, box] })
        // box frame
        const boxFrame = createObject('boxFrame', { color: [0, 0, 0] })
        const U = createObject('U', { children: [I, boxFrame], active: true })

        M1.shader = gridMaterial(getLayerKey(M1))
        M2.shader = gridMaterial(getLayerKey(M2))
        box.shader = boxSDF(getLayerKey(box))
        formula.shader = formulaSDF(getLayerKey(formula))
        boxFrame.shader = boxFrameSDF(getLayerKey(boxFrame))
        I.shader = compile(I)
        U.shader = compile(U)

        return U
}

// export const createInitPLObject = () => {
//         const Camera = createObject('I', { id: 'Camera' })
//         const Cube = createObject('I', { id: 'Cube', active: true })
//         const Light = createObject('I', { id: 'Light' })
//         const Collection = createObject('U', { id: 'Collection' }, [
//                 Camera,
//                 Cube,
//                 Light,
//         ])
//         const SceneCollection = createObject('U', {
//                 id: 'Scene Collection',
//                 children: Collection,
//         })
//         return SceneCollection
// }

export const useInitPLObject = () => {
        return useOnce(createInitPLObject)
}
