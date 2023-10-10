import * as FRACTALS from 'plre/fractals'
import { createObject } from 'plre'
import { addSuffix, attachParent, getLayerKey } from 'plre/utils'
import { PLObject } from 'plre/types'
import { normalMaterial } from 'plre/materials'
import { addMaterial } from 'plre/control'

type FRACTAL_TYPES = keyof typeof FRACTALS

export const addFractal = (type: FRACTAL_TYPES) => (obj: PLObject) => {
        const child = createObject('object')
        obj.children.push(child)
        attachParent(obj)

        const key = getLayerKey(child)
        const ids = obj.children.map((c) => c.id)
        child.shader = FRACTALS[type](key).trim()
        child.id = addSuffix(ids, child.id)

        // optional
        const mat = addMaterial(child)
        const _key = getLayerKey(mat)
        mat.shader = normalMaterial(_key).trim()
        return child
}
