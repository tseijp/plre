import * as React from 'react'
import { UploadIcon } from '../../atoms'
import { Button } from '../../atoms/Button'
import { FileSelect } from '../../molecules/FileSelect'
import { decode } from '../../templates/hooks/utils'
import { useCtx } from '../../ctx'
import { useCompile } from '..'
import { pubConnectAll } from 'plre/connect'

export const CacheUpload = () => {
        const { objectTree, storage } = useCtx()
        const compile = useCompile()
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
                        storage.cacheObject()
                        pubConnectAll(objectTree)
                }
        }

        return (
                <Button as="label" padding="0 6px 0 3px" gap="3px">
                        <FileSelect on={onRead} />
                        <UploadIcon />
                        Upload
                </Button>
        )
}
