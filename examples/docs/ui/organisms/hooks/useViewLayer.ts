import { useState } from 'react'
import { PLObject } from 'plre/types'
import { useMutable } from 'plre/react'
import type { LayerItemHandlers } from '../../molecules'
import { moveObject } from '../utils'
import { getParent } from '../../utils'
import { useOnce } from '../../atoms'

interface ViewLayerCache {
        grabbed?: PLObject | null
        hovered?: PLObject | null
        id2Item: Map<string, PLObject>
}

export const useViewLayer = (objectTree: PLObject) => {
        const [selected, setSelected] = useState<PLObject | null>(objectTree)
        const [hovered, setHovered] = useState<PLObject | null>(null)
        const cache = useOnce<ViewLayerCache>(() => ({ id2Item: new Map() }))

        const handlers = useMutable<LayerItemHandlers>({
                mount: (obj, id) => cache.id2Item.set(id, obj),
                clean: (_, id) => cache.id2Item.delete(id),
                click(obj) {
                        if (obj.active) return
                        obj.active = true
                        setHovered(void 0)
                        setSelected((p) => {
                                if (p && p !== obj) p.active = false
                                objectTree.changeActive(obj, p)
                                return obj
                        })
                },
                draging(obj, drag) {
                        const { value } = drag
                        // activate the grabbed obj
                        if (cache.grabbed !== obj) handlers.click(obj)
                        cache.grabbed = obj

                        const el = document.elementFromPoint(...value)
                        const id = el?.getAttribute('data-id')
                        let hovered = cache.id2Item.get(id)

                        // if the hovered component is not a viewlayer
                        if (!hovered) return setHovered((cache.hovered = null))
                        if (hovered.type.length !== 1)
                                hovered = getParent(objectTree, hovered)
                        if (hovered.type.length !== 1)
                                return setHovered((cache.hovered = null))

                        return setHovered(() => (cache.hovered = hovered))
                },
                dragend() {
                        const grabbed = cache.grabbed
                        const hovered = cache.hovered
                        cache.grabbed = null
                        cache.hovered = null
                        setHovered(null)
                        if (!grabbed || !hovered || grabbed === hovered) return
                        moveObject(objectTree, grabbed, hovered)
                },
        })

        return { selected, hovered, handlers }
}
