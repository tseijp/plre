import { createObject } from '.'
import type { ObjectTypes, PLObject } from './types'

export type CacheKey = keyof PLObject

export type CacheValue = string | number | (string | number)[]

export interface CacheState extends Partial<Record<CacheKey, CacheValue>> {
        _type: ObjectTypes
        _children: CacheState[]
}

const isInitArray = (arr: unknown, initValue = 0) => {
        if (!Array.isArray(arr)) return false
        return !arr.some((v) => v !== initValue)
}

export const isIgnoreCache = (key: string, value: unknown) => {
        if (key === 'memo') return true
        if (value === undefined) return true
        if (typeof value === 'function') return true
        if (key === 'matrix') return true
        if (key === 'scale') if (isInitArray(value, 1)) return true
        if (key === 'position') if (isInitArray(value, 0)) return true
        if (key === 'rotation') if (isInitArray(value, 0)) return true
        return false
}

export const exportCache = (obj: PLObject) => {
        const cache = {} as CacheState
        for (const key in obj) {
                const value = obj[key]
                if (isIgnoreCache(key, value)) continue
                if (key === 'type') {
                        cache._type = value
                        continue
                }
                if (key === 'children') {
                        if (!Array.isArray(value) || !value.length) continue
                        cache._children = [] as CacheState[]
                        value.forEach((child) => {
                                const ret = exportCache(child)
                                cache._children.push(ret)
                        })
                        continue
                }
                cache[key] = value
        }
        return cache
}

export const importCache = (cache: CacheState) => {
        const ret = {} as PLObject
        if (!cache._type) {
                console.log(cache)
                throw Error('importCache: cache._type is undefined')
        }
        for (const key in cache) {
                const value = cache[key]
                if (key === 'type' || key === 'children') continue
                if (key === '_children') {
                        if (!Array.isArray(value) || !value.length) continue
                        ret.children = []
                        value.forEach((child) => {
                                const ret = importCache(child)
                                ret.children?.push(ret)
                        })
                        continue
                }
        }

        return createObject(cache._type, ret)
}
