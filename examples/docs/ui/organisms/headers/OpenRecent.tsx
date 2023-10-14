import * as React from 'react'
import { useEffect } from 'react'
import { Drop, useForceUpdate } from '../../atoms'
import { DropItems } from '../../molecules'
import { useCtx } from '../../ctx'
import { TimerIcon } from '../../atoms'
import { byteSize, type CacheState } from 'plre/cache'
import { makeId, makeRecentName } from '.'

export const OpenRecent = () => {
        const { storage } = useCtx()
        const forceUpdate = useForceUpdate()

        const handleClick = (cache: CacheState) => () => {
                storage.changeCache?.(cache)
        }

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore
                        storage({ trySuccess: forceUpdate })
                }
                tick()
                return tick
        }, [])

        const items = storage._all ? Object.keys(storage._all) : []

        const render = (key: string) => {
                // console.log(storage._all)
                const cache = storage._all?.[key]
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
                                <span>{makeRecentName(cache)}</span>
                                <span>{cache.id}</span>
                                <span>{byteSize(cache.byte)}</span>
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
