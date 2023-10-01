import * as Objects from './objects'
import * as Materials from './materials'
import { createObject } from 'plre'
import { isOffspring, attachParent, getLayerKey } from './utils'
import type { ObjectTypes, PLObject } from './types'
import { compileCollection } from './compile'

export const activateAll = (obj: PLObject) => {
        obj.children.forEach(activateAll)
        obj.active = true
}

export const deactivateAll = (obj: PLObject) => {
        obj.children.forEach(deactivateAll)
        obj.active = false
}

export const addObject = (obj: PLObject, type: ObjectTypes) => {
        const child = createObject(type)
        const shader = Objects[type]
        if (!shader) throw Error(`No shader for ${type}`)
        obj.children.push(child)
        attachParent(obj)
        const _key = getLayerKey(child)
        child.shader = shader(_key).trim()
        addMaterial(child)
        return child
}

export const addMaterial = (obj: PLObject) => {
        const child = createObject('Material')
        const shader = Materials['basicMaterial']
        obj.children.push(child)
        attachParent(obj)
        const _key = getLayerKey(child)
        child.shader = shader(_key).trim()
        return child
}

export const addCollection = (obj: PLObject, type: ObjectTypes) => {
        const child = createObject(type)
        const shader = compileCollection(child)
        obj.children.push(child)
        obj.shader = shader
        attachParent(obj)
        return child
}

export const deleteObject = (obj: PLObject) => {
        const parent = obj.parent
        if (!parent || !parent.children) return
        const index = parent.children.indexOf(obj)
        parent.children.splice(index, 1)
}

export const moveObject = (grabbed: PLObject, hovered: PLObject) => {
        if (isOffspring(grabbed, hovered)) return alert('ERROR')
        deleteObject(grabbed)
        hovered.children.push(grabbed)
        return grabbed
}

export const sortObject = (obj: PLObject) => {
        const { children } = obj
        if (!children) return
        children.sort((a, b) => (a.id < b.id ? -1 : 1))
        children.forEach(sortObject)
        return obj
}
