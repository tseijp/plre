import { EditorState, PLObject } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { encode } from './utils'
import { getCacheAll, isCachedKey } from 'plre/cache'
import { useEffect } from 'react'
import type { CacheState } from 'plre/cache'
import event from 'reev'

export const createStorage = () => {
        const self = event({
                mount() {
                        self._all = getCacheAll()
                },
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

                self.createdAt = createdAt

                if (updatedAt === createdAt) return
                if (updatedAt === objectTree.memo.updatedAt) return

                self.updatedAt = updatedAt
                self.data = encode(objectTree)
                self.byte = new Blob([self.data]).size + ''

                try {
                        // setCache(self)
                        self._all = getCacheAll()
                        self.trySuccess?.()
                } catch (e) {
                        alert('Local storage quota exceeded')
                        console.warn(e)
                        self.catchError?.(e)
                }
        })

        useEffect(() => {
                self.mount()
                // @ts-ignore
                editorTree({ trySuccess })
                return () => {
                        // @ts-ignore
                        editorTree({ trySuccess })
                }
        }, [])

        return self
}
