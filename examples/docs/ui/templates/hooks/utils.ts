import { CacheState, encodeCache, decodeCache } from 'plre/cache'
import { PLObject } from 'plre/types'
import LZString from 'lz-string'

export const compress = (s: string) => LZString.compress(s)

export const deCompress = (s: string) => LZString.decompress(s)

export const encode = (obj: PLObject) => {
        const cache = encodeCache(obj)
        let ret = JSON.stringify(cache)
        ret = compress(ret)
        return ret
}

export const decode = (str?: string) => {
        if (!str) return
        str = deCompress(str)
        const cache = JSON.parse(str) as CacheState
        return decodeCache(cache)
}
