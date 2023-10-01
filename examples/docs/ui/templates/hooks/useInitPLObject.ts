import { createObject } from 'plre'
import { getLayerKey } from 'plre/utils'
import { compile } from 'plre/compile'
import { useOnce } from '../../atoms'

const boxSDF = (key = '') => /* CPP */ `
#define boxSize vec3(1.)

float ${key}(vec3 p) {
        vec3 d = abs(p) - boxSize;
        return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}
`

const boxFrameSDF = (key = '') => /* CPP */ `
#define min3(a, b, c) min(a, min(b, c))
#define max3(a, b, c) max(a, max(b, c))
#define boxFrameThickness .001
#define boxFrameSize vec3(1.)

float ${key}(vec3 _p) {
        vec3 p = abs(_p)     - boxFrameSize;
        vec3 q = abs(p + boxFrameThickness) - boxFrameThickness;
        return min3(
                length(max(vec3(p.x, q.y, q.z) ,0.)) + min(max3(p.x, q.y, q.z), 0.),
                length(max(vec3(q.x, p.y, q.z) ,0.)) + min(max3(q.x, p.y, q.z), 0.),
                length(max(vec3(q.x, q.y, p.z), 0.)) + min(max3(q.x, q.y, p.z), 0.)
        );
}
`

const formulaSDF = (key = '') => /* CPP */ `
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

const formulaShader = (key = '') => /* CPP */ `
#define grid(x) 1. - step(-.005, mod(x + .0025, .1)) * step(mod(x + .0025, .1), .005)
#define colorA vec3(192. / 255., 78. / 255., 255. / 255.)
#define colorB vec3(112. / 255., 200. / 255., 228. / 255.)
#define colorC vec3(255. / 255., 224. / 255., 178. / 255.)

vec3 ${key}(vec3 pos, vec3 nor) {
        vec3 col = mix(colorB, colorA, abs(nor.x));
        col = mix(col, colorC, nor.z);
        col *= grid(pos.x);
        col *= grid(pos.z);
        col = vec3(dot(col, vec3(0., 0., 1)));
        return col;
}
`

export const createInitPLObject = () => {
        // X^2 + y^2 formula
        const M = createObject('Material', { id: 'Material' })
        const formula = createObject('formula', {}, [M])
        const box = createObject('box', { color: null })
        const I = createObject('I', { children: [formula, box] })
        // box frame
        const boxFrame = createObject('boxFrame', { color: [0, 0, 0] })
        const U = createObject('U', { children: [I, boxFrame], active: true })

        M.shader = formulaShader(getLayerKey(M))
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
