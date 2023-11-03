import * as React from 'react'
import { useEffect } from 'react'
import { Button, DownloadIcon, useCall, useHoverEvent } from '../../atoms'
import { useCtx } from '../../ctx'
import { makeFileName } from '.'

export const CacheExport = () => {
        const { storage } = useCtx()
        const [background, set] = React.useState('transparent')
        const hover = useHoverEvent((state) => {
                set(state.active ? 'rgba(255,255,255,0.1)' : 'transparent')
        })

        // @TODO Cache wii be created on button click, not on event.
        const tryCached = useCall((str?: string) => {
                const el = hover.target
                if (!el) return
                if (!str) throw new Error('Cache Export Error: no cache')
                const blob = new Blob([str], { type: 'text/plain' }) // @ts-ignore
                el.href = URL.createObjectURL(blob) // @ts-ignore
                el.download = makeFileName()
        })

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore for init storage
                        storage({ tryCached })
                }
                tick()
                return tick
        }, [])

        return (
                <Button
                        as="a"
                        ref={hover.ref}
                        padding="0 6px 0px 3px"
                        gap="3px"
                        background={background}
                >
                        <DownloadIcon />
                        Export
                </Button>
        )
}
