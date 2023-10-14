import * as React from 'react'
import { useEffect } from 'react'
import { Drop, useForceUpdate } from '../../atoms'
import { DropItems } from '../../molecules'
import { useCtx } from '../../ctx'
import { TimerIcon } from '../../atoms'
import type { CacheState } from 'plre/cache'

export const OpenRecent = () => {
        const { storage } = useCtx()
        const forceUpdate = useForceUpdate()

        const handleClick = (cache: CacheState) => () => {
                storage.changeCache?.(cache)
        }

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore
                        storage({
                                mount: forceUpdate,
                                trySuccess: forceUpdate,
                                changeCache: forceUpdate,
                        })
                }
                tick()
                return tick
        }, [])

        const items = storage._all ? Object.keys(storage._all) : []

        const render = (key: string) => {
                const cache = storage._all?.[key]
                const date = new Date(cache?.updatedAt)
                return (
                        <div
                                onClick={handleClick(cache)}
                                key={key}
                                style={{
                                        gap: '0.5rem',
                                        width: '100%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                }}
                        >
                                <TimerIcon />
                                {date.toLocaleDateString()}{' '}
                                {date.toLocaleTimeString()}
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
                        <DropItems items={items}>{render}</DropItems>
                </Drop>
        )
}
