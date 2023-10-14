import { createObject } from '.'
import type { ObjectTypes, PLObject } from './types'

export type CacheKey = keyof PLObject

export type CacheValue = string | number | (string | number)[]

export interface CacheState {
        _all?: { [key: string]: CacheState }
        id: string
        byte: string
        data: string
        createdAt: string
        updatedAt: string
        mount(): void
        trySuccess?(str: string): void
        catchError?(e: Error): void
        changeCache?(target: CacheState): void
}

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

export const encodeCache = (obj: PLObject) => {
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
                                const ret = encodeCache(child)
                                cache._children.push(ret)
                        })
                        continue
                }
                cache[key] = value
        }
        return cache
}

export const decodeCache = (cache: CacheState) => {
        const ret = {} as PLObject
        if (!cache._type) {
                console.log(cache)
                throw Error('decodeCache: cache._type is undefined')
        }
        for (const key in cache) {
                const value = cache[key]
                if (key === 'type' || key === 'children') continue
                if (key === '_children') {
                        if (!Array.isArray(value) || !value.length) continue
                        ret.children = []
                        value.forEach((child) => {
                                const ret = decodeCache(child)
                                ret.children?.push(ret)
                        })
                        continue
                }
        }

        return createObject(cache._type, ret)
}

const { floor } = Math

export const byteSize = (byte: number | string) => {
        if (typeof byte === 'string') byte = parseInt(byte)
        if (isNaN(byte)) throw Error('byteSize: byte is NaN')

        if (byte < 1024) return byte + ' B'
        byte /= 1024
        if (byte < 1024) return floor(byte * 10) / 10 + ' KB'
        byte /= 1024
        if (byte < 1024) return floor(byte * 10) / 10 + ' MB'
        byte /= 1024
        if (byte < 1024) return floor(byte * 10) / 10 + ' GB'
        byte /= 1024
        return byte.toFixed(2) + 'TB'
}

export const getCacheAll = () => {
        if (typeof localStorage === 'undefined') return null
        const ret = {}
        let count = 0
        for (const key in localStorage) {
                if (!key.startsWith('PLRE')) continue
                ret[key] = getCache(key)
                count++
        }
        return count > 0 ? ret : null
}

export const getCache = (key: string) => {
        if (!key.startsWith('PLRE')) return null
        if (typeof localStorage === 'undefined') return null // for SSR
        const str = localStorage.getItem(key)
        if (!str) return null
        const cache = JSON.parse(str)
        return cache
}

export const strCache = (cache: CacheState) => {
        const { id, byte, data, createdAt, updatedAt } = cache
        const str = JSON.stringify({ id, byte, createdAt, updatedAt, data })
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
