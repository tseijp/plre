import { EditorState, PLObject } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { encode } from './utils'
import { CacheState, getCache, getCacheAll, setCache } from 'plre/cache'
import { useEffect } from 'react'
import event from 'reev'

export const createStorage = () => {
        const self = event({}) as unknown as CacheState
        return self
}

export const useInitCache = (objectTree: PLObject, editorTree: EditorState) => {
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
                self.catchError?.({} as any)

                try {
                        // setCache(self)
                        console.log(1, getCache('2023-10-14T06:57:51.743Z'))
                        console.log(2, getCacheAll())
                        console.log(3, localStorage)
                        // self.trySuccess?.()
                } catch (e) {
                        // display popup if localStorage is overflow
                        // if (e.name === 'QuotaExceededError') {
                        alert('Local storage quota exceeded')
                        console.warn(e)
                        self.catchError?.(e)
                        // }
                }

                // localStorage.setItem('PLRE.' + createdAt, JSON.stringify(cache))
        })

        useEffect(() => {
                // @ts-ignore
                editorTree({ trySuccess })
                return () => {
                        // @ts-ignore
                        editorTree({ trySuccess })
                }
        }, [])

        return self
}
