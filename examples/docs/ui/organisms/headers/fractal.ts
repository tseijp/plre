import * as FRACTALS from 'plre/fractals'
import { createObject } from 'plre'
import { addSuffix, attachParent, getLayerKey } from 'plre/utils'
import { ObjectState } from 'plre/types'
import { normalMaterial } from 'plre/materials'
import { addMaterial } from 'plre/control'

type FRACTAL_TYPES = keyof typeof FRACTALS

export const addFractal = (type: FRACTAL_TYPES) => (obj: ObjectState) => {
        const ids = obj.children.map((c) => c.id) // get ids before attach to parent
        const child = createObject('object')
        child.id = addSuffix(ids, child.id)

        obj.children.push(child)
        attachParent(obj)

        const key = getLayerKey(child) // make layer key after attach parent
        child.shader = FRACTALS[type](key).trim()

        // optional
        const mat = addMaterial(child)
        const _key = getLayerKey(mat)
        mat.shader = normalMaterial(_key).trim()
        return child
}
