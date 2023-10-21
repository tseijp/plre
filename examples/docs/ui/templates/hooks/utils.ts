import { CachedObject, encodeObject, decodeObject } from 'plre/cache'
import { PLObject } from 'plre/types'
import LZString from 'lz-string'

// for storage
export const compress = (s: string) => LZString.compress(s)

export const deCompress = (s: string) => LZString.decompress(s)

export const encode = (obj: PLObject) => {
        const cache = encodeObject(obj)
        let ret = JSON.stringify(cache)
        ret = compress(ret)
        return ret
}

export const decode = (str?: string) => {
        if (!str) return
        str = deCompress(str)
        const cache = JSON.parse(str) as CachedObject
        const ret = decodeObject(cache)
        return ret
}

// for webrtc

const TICK_TIMEOUT_MS = 1000

export const createChecker = (key: string, callback = (_key: string) => {}) => {
        let timeoutId = 0 as any
        let listeners = () => {}
        const fun = () => callback(key)
        return () => {
                listeners()
                timeoutId = setTimeout(fun, TICK_TIMEOUT_MS * 5)
                listeners = () => clearTimeout(timeoutId)
        }
}
