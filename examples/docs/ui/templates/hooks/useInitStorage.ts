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
                initObject(objectTree: PLObject) {
                        initConnectAll(objectTree)
                        subConnectAll(objectTree)
                },
                changeObject(objectTree: PLObject, obj: PLObject) {
                        delConnectAll(objectTree)
                        Object.assign(objectTree, obj)
                        self.initObject(objectTree)
                        pubConnectAll(objectTree)
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
                updateCache(objectTree: PLObject) {
                        self.id = createURL().get('id')
                        self.data = encode(objectTree)
                        self.byte = new Blob([self.data]).size + ''
                },
                cacheObject() {
                        self.isCached = true
                        self.isCacheable = false
                        const item = setCache(self)

                        /**
                         * orgs/headers/CacheExport.tsx to make cache file
                         * orgs/headers/OpenRecent.tsx to update recent info
                         */
                        self.tryCached?.(item)
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
                const recent = storage._all?.[id]
                /**
                 * orgs/headers/OpenRecent.tsx to force update UI
                 */
                const str = recent
                        ? localStorage.getItem(id)
                        : strCache(storage)
                storage.tryCached?.(str)

                set(true)
                objectTree.memo.ydoc = webrtcTree.ydoc
                storage.initObject(objectTree)

                if (!recent) return

                const obj = decode(recent.data)
                storage.changeObject(objectTree, obj)
        })

        const trySuccess = useCall(() => {
                storage.init()

                if (storage.isDuplicate) return
                if (!storage.isCacheable) return

                try {
                        if (isDev) return
                        /**
                         * create a cache on init mount to export a cache
                         * but it does not store cache in localStorage
                         */
                        storage.updateCache(objectTree)

                        if (storage.isInitMount) return

                        storage.cacheObject()
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
