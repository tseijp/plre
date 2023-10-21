import * as Objects from './objects'
import * as Materials from './materials'
import { createObject } from 'plre'
import {
        isOffspring,
        attachParent,
        getLayerKey,
        addSuffix,
        replaceAll,
} from './utils'
import type { ObjectTypes, ObjectState } from './types'
import { compileCollection } from './compile'

export const activateAll = (obj: ObjectState) => {
        obj.children.forEach(activateAll)
        obj.active = true
}

export const deactivateAll = (obj: ObjectState) => {
        obj.children.forEach(deactivateAll)
        obj.active = false
}

export const addObject = (obj: ObjectState, type: ObjectTypes) => {
        const ids = obj.children.map((c) => c.id) // get ids before attach to parent
        const child = createObject(type)
        const shader = Objects[type]
        if (!shader) throw Error(`No shader for ${type}`)

        obj.children.push(child)
        attachParent(obj)

        const key = getLayerKey(child) // make layer key after attach parent
        child.id = addSuffix(ids, child.id)
        child.shader = shader(key).trim()

        // optional
        addMaterial(child)
        return child
}

export const addMaterial = (obj: ObjectState) => {
        const child = createObject('Material')
        const shader = Materials['basicMaterial']
        const ids = obj.children.map((c) => c.id)
        child.id = addSuffix(ids, child.id)
        obj.children.push(child)
        attachParent(obj)
        const _key = getLayerKey(child)
        child.shader = shader(_key).trim()
        return child
}

export const addCollection = (obj: ObjectState, type: ObjectTypes) => {
        const child = createObject(type)
        const shader = compileCollection(child)
        const ids = obj.children.map((c) => c.id)
        child.id = addSuffix(ids, child.id)
        obj.children.push(child)
        obj.shader = shader
        attachParent(obj)
        return child
}

export const deleteObject = (obj: ObjectState) => {
        const parent = obj.parent
        if (!parent || !parent.children) return
        const index = parent.children.indexOf(obj)
        parent.children.splice(index, 1)
}

export const moveObject = (grabbed: ObjectState, hovered: ObjectState) => {
        if (isOffspring(grabbed, hovered)) return alert(ALRT())

        // save previous layer key
        const set = registerFixAll(grabbed)

        // change structure
        deleteObject(grabbed)
        hovered.children.push(grabbed)
        attachParent(hovered)

        // fix glsl code for new layer key
        set.forEach((f) => f())

        return grabbed
}

export const registerFix = (obj: ObjectState, set = new Set<Function>()) => {
        const prev = getLayerKey(obj)
        // const _prev =
        //         obj.parent && isMaterial(obj.type)
        //                 ? getLayerKey(obj.parent)
        //                 : ''

        set.add(() => {
                // if (_prev) {
                //         const _next = getLayerKey(obj.parent!)
                //         obj.shader = replaceAll(obj.shader, _prev, _next)
                // }
                const next = getLayerKey(obj)
                obj.shader = replaceAll(obj.shader, prev, next)
        })
        return set
}

export const registerFixAll = (
        obj: ObjectState,
        _set = new Set<Function>()
) => {
        const set = registerFix(obj, _set)
        if (!Array.isArray(obj.children) || obj.children.length <= 0) return set
        obj.children.forEach((child) => registerFixAll(child, set))
        return set
}

const ALRT = () => `Can't move object to its offspring.`

// Don't sort because the order is also important.
// export const sortObject = (obj: ObjectState) => {
//         const { children } = obj
//         if (!children) return
//         children.sort((a, b) => (a.id < b.id ? -1 : 1))
//         children.forEach(sortObject)
//         return obj
// }
