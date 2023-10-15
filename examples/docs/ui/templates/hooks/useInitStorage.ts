import { EditorState, PLObject } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { decode, encode } from './utils'
import { getCacheAll, isCachedKey, setCache, strCache } from 'plre/cache'
import { useEffect, useState } from 'react'
import { createURL, useCompile_ } from '../../organisms'
import type { CacheState } from 'plre/cache'
import event from 'reev'
import { WebrtcState } from '.'
import {
        delConnectAll,
        initConnectAll,
        pubConnect,
        pubConnectAll,
        subConnectAll,
} from 'plre/connect'

let isDev = false
// isDev = process.env.NODE_ENV === 'development'

export const createStorage = () => {
        const self = event({
                init() {
                        const updatedAt = new Date().toISOString()
                        const createdAt = self.createdAt || updatedAt
                        self.isDuplicate = updatedAt === self.updatedAt
                        self.isInitMount = updatedAt === createdAt
                        self.createdAt = createdAt
                        self.updatedAt = updatedAt
                },
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
        editorTree: EditorState,
        webrtcTree: WebrtcState
) => {
        const [isReady, set] = useState(false)
        const storage = useOnce<CacheState>(() => createStorage())
        const compileShader = useCompile_(objectTree, editorTree)

        storage.isReady = isReady
        storage.memo.compileShader = compileShader

        const connected = useCall(() => {
                storage.init()
                storage._all = getCacheAll()
                const id = 'PLRE' + createURL().get('id')
                const recent = storage._all[id]
                if (recent) {
                        const obj = decode(recent.data)
                        console.log({ ...obj })
                        delConnectAll(objectTree)
                        initConnectAll(obj)
                        subConnectAll(obj)
                        pubConnectAll(obj)
                        Object.assign(objectTree, obj)
                }

                /**
                 * orgs/headers/OpenRecent.tsx to force update UI
                 */
                const str = recent
                        ? localStorage.getItem(id)
                        : strCache(storage)
                storage.tryCached?.(str)
                set(true)
        })

        const trySuccess = useCall(() => {
                storage.init()

                if (storage.isDuplicate) return
                if (!storage.isCacheable) return

                try {
                        if (isDev) return
                        /**
                         * calc data if init mount
                         * create a cache on init mount to export a cache
                         * but it does not store cache in localStorage
                         */
                        storage.id = createURL().get('id')
                        storage.data = encode(objectTree)
                        storage.byte = new Blob([storage.data]).size + ''

                        if (storage.isInitMount) return
                        storage.isCached = true
                        const item = setCache(storage)

                        /**
                         * orgs/headers/CacheExport.tsx to make cache file
                         * orgs/headers/OpenRecent.tsx to update recent info
                         */
                        storage.tryCached?.(item)
                } catch (e) {
                        if (e.name === 'QuotaExceededError') {
                                alert('Local storage quota exceeded')
                                console.warn(e)
                                storage.cacheError?.(e)
                        }
                }
        })

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore
                        webrtcTree({ connected })
                        // @ts-ignore
                        editorTree({ trySuccess })
                }
                tick()
                return tick
        }, [])

        return storage
}
