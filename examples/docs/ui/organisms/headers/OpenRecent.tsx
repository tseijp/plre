import * as React from 'react'
import { useEffect } from 'react'
import { Drop, useForceUpdate } from '../../atoms'
import { DropItems, HeaderButton } from '../../molecules'
import { useCtx } from '../../ctx'
import { byteSize, createURL, makeRecentName } from '.'
import type { CacheState } from 'plre/cache'
import { CacheItem } from '../../molecules/headers/CacheItem'

export const OpenRecent = () => {
        const { storage } = useCtx()
        const tryCached = useForceUpdate()

        const handleClick = (cache: CacheState) => () => {
                const url = createURL()
                url.set('id', cache.id)
                window.open(url + '', '_blank')
        }

        const handleDelete = (cache: CacheState) => () => {
                const key = 'PLRE' + cache.id
                if (!localStorage[key] || !storage._all[key]) return
                try {
                        localStorage.removeItem(key)
                } catch (e) {
                        console.warn(e)
                }

                delete storage._all[key]
                tryCached()
        }

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore for init storage
                        storage({ tryCached })
                }
                tick()
                return tick
        }, [])

        let items = storage._all ? Object.values(storage._all) : []

        items = items.sort((a, b) => {
                if (a.id === storage.id) return -1
                if (!a || !b) return 0
                return b.updatedAt < a.updatedAt ? -1 : 1
        })

        if (storage.isCached) {
                // add current cache to the top if it is compiled
                items = items.filter((item) => item.id !== storage.id)
                items = [storage, ...items]
        }

        const render = (cache: CacheState) => {
                return (
                        <CacheItem
                                key={cache.id || Math.random()}
                                cacheId={cache.id}
                                onClick={handleClick(cache)}
                                onDelete={handleDelete(cache)}
                                fileName={makeRecentName(cache)}
                                byteSize={byteSize(cache.byte)}
                                background={
                                        cache.id === storage.id
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'transparent'
                                }
                        />
                )
        }

        const noRender = (key: number) => {
                return (
                        <div
                                key={key}
                                style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        padding: '0.25rem 0.5rem',
                                        color: 'rgba(255,255,255,0.5)',
                                }}
                        >
                                No recent files
                        </div>
                )
        }

        return (
                <Drop>
                        <HeaderButton>Open Recent</HeaderButton>
                        <DropItems items={items.length === 0 ? [1] : items}>
                                {items.length === 0 ? noRender : render}
                        </DropItems>
                </Drop>
        )
}
