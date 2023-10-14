import * as React from 'react'
import { useRef, useEffect } from 'react'
import { DownloadIcon, useCall } from '../../atoms'
import { Button } from '../../atoms/Button'
import { useCtx } from '../../ctx'
import { makeFileName } from '.'

export const CacheExport = () => {
        const { storage } = useCtx()
        const ref = useRef<HTMLLinkElement | null>(null)

        const trySuccess = useCall((str?: string) => {
                const el = ref.current
                if (!el) return
                if (!str) throw new Error('Cache Export Error: no cache')
                const blob = new Blob([str], { type: 'text/plain' })
                el.href = URL.createObjectURL(blob) // @ts-ignore
                el.download = makeFileName()
        })

        useEffect(() => {
                const tick = () => {
                        // @ts-ignore
                        storage({ trySuccess })
                }
                tick()
                return tick
        }, [])
        return (
                <Button as="a" ref={ref} padding="0 6px 0px 3px" gap="3px">
                        <DownloadIcon />
                        Export
                </Button>
        )
}
