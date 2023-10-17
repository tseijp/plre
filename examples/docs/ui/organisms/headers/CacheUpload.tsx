import * as React from 'react'
import { UploadIcon, useHoverEvent } from '../../atoms'
import { Button } from '../../atoms/Button'
import { FileSelect } from '../../molecules/FileSelect'
import { decode } from '../../templates/hooks/utils'
import { useCtx } from '../../ctx'
import { useCompile } from '..'
import { pubConnectAll } from 'plre/connect'

export const CacheUpload = () => {
        const { objectTree, storage } = useCtx()
        const compile = useCompile()
        const [background, set] = React.useState('transparent')
        const hover = useHoverEvent((state) => {
                set(state.active ? 'rgba(255,255,255,0.1)' : 'transparent')
        })

        const onRead = (blob: Blob) => {
                if (!blob) return
                const reader = new FileReader()
                reader.readAsText(blob)
                reader.onload = () => {
                        if (!reader.result) return
                        const cache = JSON.parse(reader.result as string)
                        const obj = decode(cache.data as string)
                        storage.changeObject(objectTree, obj)
                        compile()
                        storage.updateCache(objectTree)
                        // storage.cacheObject() !!!!!!!!!!!!!!!
                        pubConnectAll(objectTree)
                }
        }

        return (
                <Button
                        ref={hover.ref}
                        as="label"
                        padding="0 6px 0 3px"
                        gap="3px"
                        background={background}
                >
                        <FileSelect on={onRead} />
                        <UploadIcon />
                        Upload
                </Button>
        )
}
