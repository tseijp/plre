import * as ShaderChunk from './shader'
import { ObjectTypes, PL, ObjectState, Vec3 } from './types'

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

export const attachParent = (self: ObjectState) => {
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
        if (value === 'DELETED') return true
        if (typeof value !== 'string' && typeof value !== 'number') return true
        if (key === 'children') return true
        if (key === 'parent') return true
        if (key === 'memo') return true
        return false
}

export const isTransformKey = (key = '') => {
        if (key.length !== 2) return false
        const [p, x] = key.split('')
        if (p === 'p') return true
        if (p === 'r') return true
        if (p === 's') return true
        if (x === 'x') return true
        if (x === 'y') return true
        if (x === 'z') return true
        return false
}
const isFun = (a: unknown): a is Function => typeof a === 'function'

type Value = number | ((prev: number) => number)

export const setTransformFromKey = (
        obj: ObjectState,
        key = '',
        value: Value
) => {
        const [p, x] = key.split('')
        let target: Vec3
        if (p === 'p') target = obj.position
        else if (p === 'r') target = obj.rotation
        else if (p === 's') target = obj.scale
        if (x === 'x')
                return (target[0] = isFun(value) ? value(target[0]) : value)
        if (x === 'y')
                return (target[1] = isFun(value) ? value(target[1]) : value)
        if (x === 'z')
                return (target[2] = isFun(value) ? value(target[2]) : value)
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

export const getLayerKey = (obj: ObjectState) => {
        if (!obj.parent) return obj.key
        return getLayerKey(obj.parent) + '_' + obj.key
}

export const replaceAll = (key: string, prev = ' ', next = '') => {
        return key.split(prev).join(next)
}

export const withMat = (key: string) => key + '_Material'

export const withoutMat = (key: string) => replaceAll(key, '_Material', '')

export const getActiveObjects = (obj: ObjectState) => {
        const ret = [] as ObjectState[]
        if (obj.active) ret.push(obj)
        obj.children.forEach((child) => {
                getActiveObjects(child).forEach((_obj) => {
                        ret.push(_obj)
                })
        })
        return ret
}

const { sin, cos } = Math

export const mat4 = (
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = [1, 1, 1],
        ret: number[] = []
) => {
        const [px, py, pz] = position.map((p) => -p)
        const [ax, ay, az] = rotation.map(cos)
        const [bx, by, bz] = rotation.map(sin)
        const [sx, sy, sz] = scale.map((s) => 1 / s)
        ret[0] = sx * az * ay
        ret[1] = sx * (az * by * bx - bz * ax)
        ret[2] = sx * (az * by * ax + bz * bx)
        ret[3] = 0
        ret[4] = sy * bz * ay
        ret[5] = sy * (bz * by * bx + az * ax)
        ret[6] = sy * (bz * by * ax - az * bx)
        ret[7] = 0
        ret[8] = sz * -by
        ret[9] = sz * ay * bx
        ret[10] = sz * ay * ax
        ret[11] = 0
        ret[12] = px
        ret[13] = py
        ret[14] = pz
        ret[15] = 1
        return ret
}

export const uniformMat4 = (self: PL, obj: ObjectState) => {
        const { parent, position, rotation, scale } = obj

        // @NOTE function name of obj in top is fixed in map
        const _key = parent ? getLayerKey(obj) : 'map'
        const _mat = mat4(position, rotation, scale, obj.matrix)
        // @ts-ignore TODO FIX glre type
        self.uniform(_key + '_M', _mat, true)
}

export const uniformMat4All = (self: PL, obj: ObjectState) => {
        const { children } = obj
        uniformMat4(self, obj)
        if (!Array.isArray(children) || children.length === 0) return
        obj.children.forEach((child) => {
                uniformMat4All(self, child)
        })
}
