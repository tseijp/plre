import { createObject } from '.'
import type { ObjectTypes, ObjectState } from './types'

export type CacheKey = keyof ObjectState

export type CacheValue = string | number | (string | number)[]

export interface CacheState {
        _all?: { [key: string]: CacheState }
        isReady: boolean
        isCached: boolean
        isCacheable: boolean
        isDuplicate: boolean
        isInitMount: boolean
        id: string
        byte: string
        data: string
        createdAt: string
        updatedAt: string
        username: string
        initStorage(): void
        initWithSubscribe(objectTree: ObjectState, ydoc: any): void
        initWithoutCache(objectTree: ObjectState, ydoc: any): void
        initWithCache(
                objectTree: ObjectState,
                ydoc: any,
                obj: ObjectState
        ): void
        setCache(): void
        changeStorage(objectTree: ObjectState, webrtcTree: any): void
        updateCache(objectTree: ObjectState, webrtcTree: any): void
        changeCache?(target: CacheState): void
        tryCached?(str: string): void
        cacheError?(e: Error): void
        memo: any
}

export interface CachedObject extends Partial<Record<CacheKey, CacheValue>> {
        _children: CachedObject[]
}

const isInitArray = (arr: unknown, initValue = 0) => {
        if (!Array.isArray(arr)) return false
        return !arr.some((v) => v !== initValue)
}

export const isIgnoreCache = (key: string, value: unknown) => {
        if (key === 'memo') return true
        if (key === 'matrix') return true
        if (value === undefined) return true
        if (typeof value === 'function') return true
        if (key === 'scale' && isInitArray(value, 1)) return true
        if (key === 'position' && isInitArray(value, 0)) return true
        if (key === 'rotation' && isInitArray(value, 0)) return true
        return false
}

export const encodeObject = (obj: ObjectState) => {
        const ret = {} as CachedObject
        for (const key in obj) {
                const value = obj[key]
                if (isIgnoreCache(key, value)) continue
                if (key === 'children') {
                        if (!Array.isArray(value) || !value.length) continue
                        // not children but _children !!
                        ret._children = [] as CachedObject[]
                        value.forEach((child) => {
                                const _ret = encodeObject(child)
                                ret._children.push(_ret)
                        })
                        continue
                }
                ret[key] = value
        }
        return ret
}

export const decodeObject = (cache: CachedObject) => {
        const ret = { children: [] as any } as ObjectState
        if (!cache.type) {
                throw Error('decodeObject: cache.type is undefined')
        }
        for (const key in cache) {
                const value = cache[key]
                // not children but _children !!
                if (key === '_children') {
                        if (!Array.isArray(value)) continue
                        value.forEach((child) => {
                                const childObj = decodeObject(child)
                                ret.children.push(childObj)
                        })
                        continue
                }
                ret[key] = value
        }
        return createObject(cache.type as ObjectTypes, ret)
}

export const assignObject = (objectTree: ObjectState, target: ObjectState) => {
        for (const key in target) {
                const value = target[key]
                if (isIgnoreCache(key, value)) continue
                objectTree[key] = value
        }
        return objectTree
}

export const getCacheAll = () => {
        const ret = {}
        for (const key in localStorage) {
                if (!key.startsWith('PLRE')) continue
                ret[key] = getCache(key)
        }
        return ret
}

export const getCache = (key: string) => {
        if (!key.startsWith('PLRE')) return null
        const str = localStorage.getItem(key)
        return !str ? null : JSON.parse(str)
}

export const strCache = (cache: CacheState) => {
        const { id, byte, data, createdAt, updatedAt, username } = cache
        const str = JSON.stringify({
                id,
                byte,
                createdAt,
                updatedAt,
                username,
                data,
        })
        return str
}

export const setCache = (cache: CacheState) => {
        if (typeof localStorage === 'undefined') return null
        const str = strCache(cache)
        const key = 'PLRE' + cache.id
        try {
                localStorage.setItem(key, str)
                return str
        } catch (e) {
                throw e
        }
}

export const isCachedKey = (key: string) => {
        if (
                key === 'id' ||
                key === 'byte' ||
                key === 'data' ||
                key === 'createdAt' ||
                key === 'updatedAt'
        )
                return true
        return false
}
