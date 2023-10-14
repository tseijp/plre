import { EditorState, PLObject } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { encode } from './utils'
import { getCacheAll, isCachedKey, setCache, strCache } from 'plre/cache'
import { useEffect } from 'react'
import { createURL } from '../../organisms'
import type { CacheState } from 'plre/cache'
import event from 'reev'

let isDev = false
// isDev = process.env.NODE_ENV === 'development'

export const createStorage = () => {
        const self = event({
                changeCache(cache: CacheState) {
                        for (const key in cache) {
                                if (!isCachedKey(key)) continue
                                self[key] = cache[key]
                        }
                },
        }) as unknown as CacheState
        return self
}

export const useInitStorage = (
        objectTree: PLObject,
        editorTree: EditorState
) => {
        const self = useOnce<CacheState>(() => createStorage())

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
                        // calc data if init mount
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
