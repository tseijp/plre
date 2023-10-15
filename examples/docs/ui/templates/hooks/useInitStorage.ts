import { EditorState, PLObject } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { decode, encode } from './utils'
import { getCacheAll, isCachedKey, setCache, strCache } from 'plre/cache'
import { useEffect } from 'react'
import { createURL, useCompile_ } from '../../organisms'
import type { CacheState } from 'plre/cache'
import event from 'reev'

let isDev = false
// isDev = process.env.NODE_ENV === 'development'

export const createStorage = (objectTree: PLObject) => {
        const self = event({
                changeCache(cache: CacheState) {
                        try {
                                // this code is to compile from local storage
                                // const obj = decode(cache.data)
                                // const url = createURL()
                                // url.set('id', cache.id)
                                // url.replaceState() // @TODO DELETE
                                // objectTree.memo.set(() => obj)
                                // self.memo.compileShader(obj)
                        } catch (e) {
                                console.warn(e)
                                return
                        }
                        for (const key in cache) {
                                if (!isCachedKey(key)) continue
                                self[key] = cache[key]
                        }
                },
                memo: {},
        }) as unknown as CacheState
        return self
}

export const useInitStorage = (
        objectTree: PLObject,
        editorTree: EditorState
) => {
        const self = useOnce<CacheState>(() => createStorage(objectTree))
        const compileShader = useCompile_(objectTree, editorTree)

        self.memo.compileShader = compileShader

        const trySuccess = useCall(() => {
                const updatedAt = new Date().toISOString()
                const createdAt = self.createdAt || updatedAt
                const isDuplicate = updatedAt === self.updatedAt
                const isInitMount = updatedAt === createdAt
                self.createdAt = createdAt
                self.updatedAt = updatedAt

                if (isDuplicate) return

                try {
                        if (isDev) return
                        /**
                         * calc data if init mount
                         * create a cache on init mount to export a cache
                         * but it does not store cache in localStorage
                         */
                        self.id = createURL().get('id')
                        self.data = encode(objectTree)
                        self.byte = new Blob([self.data]).size + ''

                        if (isInitMount) {
                                self._all = getCacheAll()
                                const cache = strCache(self)
                                return self.trySuccess?.(cache)
                        } else {
                                self.isCached = true
                                const cache = setCache(self)
                                self.trySuccess?.(cache)
                        }
                } catch (e) {
                        if (e.name === 'QuotaExceededError') {
                                alert('Local storage quota exceeded')
                                console.warn(e)
                                self.catchError?.(e)
                        }
                }
        })

        useEffect(() => {
                // @ts-ignore
                const tick = () => editorTree({ trySuccess })
                tick()
                return tick
        }, [])

        return self
}
