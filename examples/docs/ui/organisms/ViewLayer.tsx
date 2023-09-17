import * as React from 'react'
import { useState, useRef } from 'react'
import { DragState, Flex, Tree, useCall } from '../atoms'
import { Header, LayerItem } from '../molecules'
import { PLObject } from 'plre/types'
import { useMutable } from 'plre/react'
import type { ReactNode } from 'react'
import type { EditorState } from 'plre/types'
import type { LayerItemHandlers } from '../molecules'
export interface ViewLayerProps {
        objectTree: PLObject
        // header props
        editorTree: EditorState
        editorItem: EditorState
}

interface ViewLayerCache {
        grabbed?: PLObject | null
        hovered?: PLObject | null
        id2Item: Map<string, PLObject>
}

export const ViewLayer = (props: ViewLayerProps) => {
        const { objectTree, ...headerProps } = props
        const [selected, setSelected] = useState<PLObject | null>(objectTree)
        const [hovered, setHovered] = useState<PLObject | null>(null)
        const cache = useRef<ViewLayerCache>({ id2Item: new Map() }).current

        // console.table(extend(objectTree))

        const handlers = useMutable<LayerItemHandlers>({
                mount: (obj, id) => cache.id2Item.set(id, obj),
                clean: (_, id) => cache.id2Item.delete(id),
                click(obj) {
                        if (obj.active) return
                        obj.active = true
                        setHovered(void 0)
                        setSelected((p) => {
                                if (p && p !== obj) p.active = false
                                return obj
                        })
                },
                draging(obj, drag) {
                        const { value } = drag
                        if (cache.grabbed !== obj) handlers.click(obj)
                        const el = document.elementFromPoint(...value)
                        const id = el?.getAttribute('data-id')
                        cache.grabbed = obj
                        cache.hovered = cache.id2Item.get(id)
                        if (!cache.hovered || cache.grabbed === cache.hovered)
                                return setHovered(null)
                        setHovered(() => cache.hovered)
                },
                dragend() {
                        cache.grabbed = null
                        cache.grabbed = null
                        setHovered(null)
                },
        })

        const render = (obj: PLObject, grand: ReactNode, index = 0) => (
                <LayerItem
                        key={obj.id}
                        obj={obj}
                        index={index}
                        active={selected === obj}
                        disable={hovered === obj}
                        handlers={handlers}
                >
                        {grand}
                </LayerItem>
        )

        return (
                <Flex backgroundColor="#282828">
                        <Header {...headerProps} />
                        <Flex
                                // backgroundImage="linear-gradient(0deg, #ffff00 50%, #0000ff 50%)"
                                backgroundImage="linear-gradient(0deg, #282828 50%, #2B2B2B 50%)"
                                backgroundSize="40px 40px"
                                alignItems="start"
                                justifyContent="start"
                                color="#fff"
                                marginTop="6px"
                        >
                                <Tree tree={objectTree}>{render}</Tree>
                        </Flex>
                </Flex>
        )
}
