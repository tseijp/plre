import { useEffect, useState } from 'react'
import { ObjectState } from 'plre/types'
import { useMutable } from 'plre/react'
import { deactivateAll, moveObject } from 'plre/control'
import { useCall, useOnce } from '../../atoms'
import { getActiveObjects, isAddable } from 'plre/utils'
import { useCtx } from '../../ctx'
import { useCompile } from '.'
import type { LayerItemHandlers } from '../layers'
import {
        delConnectAll,
        initConnectAll,
        pubConnectAll,
        subConnectAll,
} from 'plre/connect'

interface ViewLayerCache {
        grabbed?: ObjectState | null
        hovered?: ObjectState | null
        id2Item: Map<string, ObjectState>
}

export const useViewLayer = () => {
        const compile = useCompile()
        const { editorTree, objectTree, storage } = useCtx()
        const [hovered, setHovered] = useState<ObjectState | null>(null)
        const [selected, setSelected] = useState<ObjectState | null>(
                getActiveObjects(objectTree)[0]
        )
        const cache = useOnce<ViewLayerCache>(() => ({ id2Item: new Map() }))

        const changeActive = useCall((next: ObjectState) => {
                if (!next) next = getActiveObjects(objectTree)[0]
                setSelected((p) => (p === next ? p : next))
        })

        useEffect(() => {
                // @ts-ignore
                const tick = () => editorTree({ changeActive })
                tick()
                return tick
        })

        const handlers = useMutable<LayerItemHandlers>({
                mount: (obj, id) => cache.id2Item.set(id, obj),
                clean: (_, id) => cache.id2Item.delete(id),
                click(obj) {
                        deactivateAll(objectTree)
                        obj.active = true
                        setHovered(void 0)
                        editorTree.changeActive?.(obj)
                        setSelected(() => obj)
                },
                draging(obj, drag) {
                        const { value } = drag

                        // activate the grabbed obj
                        if (cache.grabbed !== obj) handlers.click(obj)
                        cache.grabbed = obj

                        const el = document.elementFromPoint(...value)
                        const id = el?.getAttribute('data-id')
                        let hovered = cache.id2Item.get(id)
                        let isCancel = false

                        // if the hovered component is not a viewlayer
                        if (hovered === obj) return

                        if (!hovered) return setHovered((cache.hovered = null))

                        const type = obj.type
                        if (!isAddable(hovered?.type, type) && hovered?.parent)
                                hovered = hovered.parent
                        if (!isAddable(hovered?.type, type) && hovered?.parent)
                                hovered = hovered.parent
                        if (!isAddable(hovered?.type, type)) isCancel = true
                        if (isCancel) setHovered((cache.hovered = null))
                        else setHovered(() => (cache.hovered = hovered))
                },
                dragend() {
                        const grabbed = cache.grabbed
                        const hovered = cache.hovered
                        cache.grabbed = null
                        cache.hovered = null
                        setHovered(null)
                        if (
                                !grabbed ||
                                !hovered ||
                                grabbed === hovered ||
                                grabbed.parent === hovered // Subscribe will stop if the position is not moved
                        )
                                return

                        // delete connection
                        delConnectAll(grabbed)

                        // attach parent
                        moveObject(grabbed, hovered)

                        // create connection
                        initConnectAll(grabbed)
                        pubConnectAll(grabbed)
                        subConnectAll(grabbed)

                        // Cache only own changes in localStorage
                        storage.isCacheable = true

                        // finish
                        compile()
                },
        })

        return { selected, hovered, handlers }
}
