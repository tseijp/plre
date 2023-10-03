import * as ShaderChunk from './shader'
import { ObjectTypes, PLObject } from './types'

export const isMaterial = (type: ObjectTypes) => type === 'Material'

export const isObject = (type: ObjectTypes) =>
        !isMaterial(type) && type?.length > 1

export const isCollection = (type: ObjectTypes) =>
        !isMaterial(type) && type?.length === 1

export const isAddable = (target: ObjectTypes, type: ObjectTypes) => {
        if (isCollection(target) && isCollection(type)) return true
        if (isCollection(target) && isObject(type)) return true
        if (isObject(target) && isMaterial(type)) return true
        return false
}

export const attachParent = (self: PLObject) => {
        const ids = [] as string[]
        self.children.forEach((child) => {
                child.parent = self
                child.key = addSuffix(ids, child.key)
                ids.push(child.key)
        })
        return self
}

export const isOffspring = <T extends { children: T[] }>(
        target: T,
        self: T
) => {
        if (!target.children || target.children.length === 0) return false
        if (target.children.includes(self)) return true
        for (const child of target.children)
                if (isOffspring(child, self)) return true
        return false
}

export const isIgnoreProp = (value: unknown, key: string) => {
        if (typeof value !== 'string' && typeof value !== 'number') return true
        if (key === 'children') return true
        if (key === 'parent') return true
        if (key === 'memo') return true
        return false
}

export const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm

export const resolveIncludes = (str = '') => {
        return str.replace(includePattern, includeReplacer)
}

export const shaderChunkMap = new Map([])

export const includeReplacer = (_ = '', include = '') => {
        let str = ShaderChunk[include]
        if (!str) str = shaderChunkMap.get(include)
        return resolveIncludes(str)
}

export const addSuffix = (ids = [''], id = '') => {
        let suffix = ''
        let index = 1
        const match = id.match(/^(_*)\.(\d{3})$/)
        if (match) id = match[1]
        const some = (name = '') => ids.some((_id) => _id === name)
        while (some(id + suffix)) {
                suffix = '_' + String(index).padStart(3, '0')
                index++
        }
        return id + suffix
}

export const getLayerKey = (obj: PLObject) => {
        if (!obj.parent) return obj.key
        return getLayerKey(obj.parent) + '_' + obj.key
}

export const getActiveObjects = (obj: PLObject) => {
        const ret = [] as PLObject[]
        if (obj.active) ret.push(obj)
        obj.children.forEach((child) => {
                getActiveObjects(child).forEach((_obj) => {
                        ret.push(_obj)
                })
        })
        return ret
}
