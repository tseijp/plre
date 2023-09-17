import * as React from 'react'
import { useState, useRef } from 'react'
import { DragState, Flex, Tree, useCall } from '../atoms'
import { Header, LayerItem } from '../molecules'
import { PLObject } from 'plre/types'
import type { ReactNode } from 'react'
import type { EditorState } from 'plre/types'

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

// const extend = <T extends { children: T[] }>(target) => {
//         let ret = [{ ...target }]
//         if (!target.children) return ret
//         target.children.forEach((child) => {
//                 if (child) ret.push(extend(child))
//         })
//         return ret
// }

export const ViewLayer = (props: ViewLayerProps) => {
        const { objectTree, ...headerProps } = props
        const [selected, setSelected] = useState<PLObject | null>(objectTree)
        const [hovered, setHovered] = useState<PLObject | null>(null)
        const cache = useRef<ViewLayerCache>({ id2Item: new Map() }).current

        // console.table(extend(objectTree))

        const handleMount = useCall((obj: PLObject) => (id: string) => {
                cache.id2Item.set(id, obj)
                return () => cache.id2Item.delete(id)
        })

        const handleClick = useCall((obj: PLObject) => () => {
                if (obj.active) return
                obj.active = true
                setHovered(void 0)
                setSelected((p) => {
                        if (p && p !== obj) p.active = false
                        return obj
                })
        })

        const handleDrag = useCall((obj: PLObject) => (drag: DragState) => {
                const { _active, active, value } = drag
                const draging = _active && active
                const dragend = _active && !active
                if (dragend) {
                        cache.grabbed = null
                        cache.grabbed = null
                        setHovered(null)
                }
                if (draging) {
                        if (cache.grabbed !== obj) handleClick(obj)()
                        const el = document.elementFromPoint(...value)
                        const id = el?.getAttribute('data-id')
                        cache.grabbed = obj
                        cache.hovered = cache.id2Item.get(id)

                        if (!cache.hovered) return setHovered(null)
                        if (cache.grabbed === cache.hovered) return
                        setHovered(cache.hovered)
                }
        })

        const render = (obj: PLObject, grand: ReactNode, index = 0) => (
                <LayerItem
                        objId={obj.id}
                        index={index}
                        icon={obj.type?.[0]}
                        active={selected === obj}
                        disable={hovered === obj}
                        onMount={handleMount(obj)}
                        onClick={handleClick(obj)}
                        onDrag={handleDrag(obj)}
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
