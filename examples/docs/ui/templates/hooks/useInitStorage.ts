import event from 'reev'
import { EditorState, ObjectState } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { decode, encode } from './utils'
import {
        assignObject,
        encodeObject,
        getCacheAll,
        isCachedKey,
        setCache,
} from 'plre/cache'
import { useEffect, useState } from 'react'
import { createURL } from '../../organisms'
import { WebrtcState } from '.'
import {
        delConnectAll,
        initConnectAll,
        pubConnectAll,
        subConnectAll,
} from 'plre/connect'
import { attachParent } from 'plre/utils'
import { deleteObject } from 'plre/control'
import type { CacheState } from 'plre/cache'

let isDev = false
// isDev = process.env.NODE_ENV === 'development'

export const createStorage = () => {
        const initStorage = () => {
                const updatedAt = new Date().toISOString()
                const createdAt = self.createdAt || updatedAt
                self.id = createURL().get('id')
                self.isDuplicate = updatedAt === self.updatedAt
                self.isInitMount = updatedAt === createdAt
                self.createdAt = createdAt
                self.updatedAt = updatedAt
        }

        const initPreferSubscribe = (objectTree: ObjectState, ydoc: any) => {
                objectTree.memo.ydoc = ydoc
                /**
                 * @TODO Do not subscribe deleted object
                 * but Delete by yourself, data will be lost
                 */
                objectTree.children.forEach(deleteObject) // !!!!!!!!!!!!!!!
                initConnectAll(objectTree)
                subConnectAll(objectTree)
        }

        const initWithoutCache = (objectTree: ObjectState, ydoc: any) => {
                objectTree.memo.ydoc = ydoc
                initConnectAll(objectTree)
                subConnectAll(objectTree)
        }

        const initWithCache = (
                objectTree: ObjectState,
                ydoc: any,
                obj: ObjectState
        ) => {
                objectTree.memo.ydoc = ydoc
                console.log(encodeObject(objectTree))
                // cleanup
                initConnectAll(objectTree)
                subConnectAll(objectTree)
                delConnectAll(objectTree)

                // clone
                assignObject(objectTree, obj)
                attachParent(objectTree)
                initConnectAll(objectTree)
                pubConnectAll(objectTree)
                subConnectAll(objectTree)
        }

        const changeStorage = (
                objectTree: ObjectState,
                webrtcTree: WebrtcState
        ) => {
                const id = 'PLRE' + createURL().get('id')
                const recent = self._all?.[id]
                const isFirst = webrtcTree.users.size === 1

                // nothing is done if there is no cache
                if (!recent) {
                        self.initWithoutCache(objectTree, webrtcTree.ydoc)
                        return
                }

                // use subscribe data if someone else is there @TODO fix order ↑
                if (!isFirst) {
                        self.initPreferSubscribe(objectTree, webrtcTree.ydoc)
                        return
                }

                // load from cache
                // @TODO CEHCK DB
                // const updatedAtDB = await fetch(...)
                const obj = decode(recent.data)
                self.initWithCache(objectTree, webrtcTree.ydoc, obj)
        }
        const changeCache = (cache: CacheState) => {
                for (const key in cache) {
                        if (!isCachedKey(key)) continue
                        self[key] = cache[key]
                }
        }

        const updateCache = (objectTree: ObjectState) => {
                self.data = encode(objectTree)
                self.byte = new Blob([self.data]).size + ''

                if (self.isInitMount) return

                self.isCached = true
                self.isCacheable = false
                const item = setCache(self)

                /**
                 * orgs/headers/CacheExport.tsx to make cache file
                 * orgs/headers/OpenRecent.tsx to update recent info
                 */
                self.tryCached?.(item)
        }

        const self = event({
                initStorage,
                initPreferSubscribe,
                initWithoutCache,
                initWithCache,
                changeStorage,
                changeCache,
                updateCache,
                isCached: false,
                isCacheable: false,
                isDuplicate: false,
                isInitMount: false,
                createdAt: '',
                updatedAt: '',
                data: '',
                byte: '',
                id: '',
                _all: {},
                memo: {},
        }) as unknown as CacheState
        return self
}

export const useInitStorage = (
        objectTree: ObjectState,
        editorTree: EditorState,
        webrtcTree: WebrtcState
) => {
        const [isReady, set] = useState(false)
        const storage = useOnce<CacheState>(() => createStorage())
        storage.isReady = isReady

        const connected = useCall(() => {
                storage.initStorage()
                storage._all = getCacheAll()
                storage.changeStorage(objectTree, webrtcTree)

                // notify what is active object
                editorTree.changeActive?.()

                set(true)
        })

        const trySuccess = useCall(() => {
                storage.initStorage()
                if (storage.isDuplicate) return
                if (!storage.isCacheable) return

                try {
                        if (isDev) return
                        /**
                         * create a cache on init mount to export a cache
                         * but it does not store cache in localStorage
                         */
                        storage.updateCache(objectTree)
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
