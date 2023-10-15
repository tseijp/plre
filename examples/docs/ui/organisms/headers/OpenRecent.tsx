import * as React from 'react'
import { useEffect } from 'react'
import { Drop, useForceUpdate } from '../../atoms'
import { DropItems } from '../../molecules'
import { useCtx } from '../../ctx'
import { TimerIcon } from '../../atoms'
import { byteSize, makeRecentName } from '.'
import type { CacheState } from 'plre/cache'

export const OpenRecent = () => {
        const { storage } = useCtx()
        const forceUpdate = useForceUpdate()

        const handleClick = (cache: CacheState) => () => {
                storage.changeCache?.(cache)
        }

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore for init storage
                        storage({ trySuccess: forceUpdate })
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
                        <div
                                onClick={handleClick(cache)}
                                key={cache.id}
                                style={{
                                        gap: '0.5rem',
                                        width: '100%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        background:
                                                cache.id === storage.id
                                                        ? 'rgba(255,255,255,0.1)'
                                                        : 'transparent',
                                }}
                        >
                                <TimerIcon />
                                <span
                                        style={{
                                                width: '8rem',
                                                textOverflow: 'ellipsis',
                                        }}
                                >
                                        {makeRecentName(cache)}
                                </span>
                                <span style={{ fontSize: '0.75rem' }}>
                                        {byteSize(cache.byte)}
                                </span>
                                <span
                                        style={{
                                                width: '5rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                        }}
                                >
                                        {cache.id}
                                </span>
                        </div>
                )
        }

        const noRender = (key: number) => {
                return (
                        <div
                                key={key}
                                style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        color: 'rgba(255,255,255,0.5)',
                                }}
                        >
                                No recent files
                        </div>
                )
        }

        return (
                <Drop>
                        <span
                                style={{
                                        height: 18,
                                        padding: '0 0.25rem',
                                        textAlign: 'center',
                                        pointerEvents: storage._all
                                                ? 'auto'
                                                : 'none',
                                }}
                        >
                                Open Recent
                        </span>
                        <DropItems items={items.length === 0 ? [1] : items}>
                                {items.length === 0 ? noRender : render}
                        </DropItems>
                </Drop>
        )
}
