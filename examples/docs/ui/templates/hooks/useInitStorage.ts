import { EditorState, ObjectState } from 'plre/types'
import { useCall, useOnce } from '../../atoms'
import { decode, encode } from './utils'
import { assignObject, getCacheAll, isCachedKey, setCache } from 'plre/cache'
import { useEffect, useState } from 'react'
import { createURL } from '../../organisms'
import type { CacheState } from 'plre/cache'
import event from 'reev'
import { WebrtcState } from '.'
import {
        delConnectAll,
        initConnectAll,
        pubConnectAll,
        subConnectAll,
} from 'plre/connect'
import { attachParent } from 'plre/utils'
import { deleteObject } from 'plre/control'

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

        const initObject = (objectTree: ObjectState, ydoc: any) => {
                objectTree.memo.ydoc = ydoc
                initConnectAll(objectTree)
                subConnectAll(objectTree)
        }

        const delObject = (objectTree: ObjectState, ydoc: any) => {
                objectTree.memo.ydoc = ydoc
                objectTree.children.forEach(deleteObject)
                initConnectAll(objectTree)
                subConnectAll(objectTree)
        }

        const changeObject = (
                objectTree: ObjectState,
                ydoc: any,
                obj: ObjectState
        ) => {
                objectTree.memo.ydoc = ydoc
                // initConnectAll(objectTree) ??
                // delConnectAll(objectTree) ??
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

                if (!recent) {
                        self.initObject(objectTree, webrtcTree.ydoc)
                        return
                }

                if (!isFirst) {
                        self.delObject(objectTree, webrtcTree.ydoc)
                        return
                }

                // TODO CEHCK DB
                // const updatedAtDB = await fetch(...)
                const obj = decode(recent.data)
                self.changeObject(objectTree, webrtcTree.ydoc, obj)
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
                initObject,
                delObject,
                changeObject,
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
