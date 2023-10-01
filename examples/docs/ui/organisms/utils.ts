import * as ObjectShaders from './objects'
import { createObject } from 'plre'
import { attachParent, getLayerKey } from 'plre/utils'
import type { ObjectTypes, PLObject } from 'plre/types'
import { getParent, isOffspring } from '../utils'

export const addObject = (obj: PLObject, type: ObjectTypes) => {
        const child = createObject(type)
        const shader = ObjectShaders[type]
        if (!shader) throw Error(`No shader for ${type}`)
        obj.children.push(child)
        attachParent(obj)
        const _key = getLayerKey(child)
        child.shader = shader(_key).trim()
        child.active = true
        return child
}

export const deleteObject = (obj: PLObject) => {
        const parent = obj.parent
        if (!parent || !parent.children) return
        const index = parent.children.indexOf(obj)
        parent.children.splice(index, 1)
}

export const moveObject = (
        obj: PLObject,
        grabbed: PLObject,
        hovered: PLObject
) => {
        if (isOffspring(grabbed, hovered)) return alert('ERROR')
        const parent = getParent(obj, grabbed)
        hovered.children.push(grabbed)
        parent.children.splice(parent.children.indexOf(grabbed), 1)
        sortObject(obj)
        return obj
}

export const sortObject = (obj: PLObject) => {
        const { children } = obj
        if (!children) return
        children.sort((a, b) => (a.id < b.id ? -1 : 1))
        children.forEach(sortObject)
        return obj
}
