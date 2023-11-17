import * as React from 'react'
import { Button, UploadIcon, useHoverEvent } from '../../atoms'
import { FileSelect } from '../../molecules/FileSelect'
import { decode } from '../../templates/hooks/utils'
import { createURL } from '..'
import { setCache } from 'plre/cache'

export const CacheUpload = () => {
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
                        try {
                                const cache = JSON.parse(reader.result as any)
                                const id = cache.id
                                if (!decode(cache.data as string)) return
                                setCache(cache)
                                const url = createURL()
                                url.set('id', id)
                                window.open(url + '', '_blank')
                        } catch (e) {
                                console.warn(e)
                        }
                        /**
                         * DO NOT COMPILE SAME PAGE
                         */
                        // storage.initWithCache(objectTree, webrtcTree.ydoc, obj)
                        // compile()
                        // storage.updateCache(objectTree)
                        // // storage.cacheObject() !!!!!!!!!!!!!!!
                        // pubConnectAll(objectTree)
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
