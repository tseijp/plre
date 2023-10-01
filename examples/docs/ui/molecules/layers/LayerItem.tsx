import * as React from 'react'
import { useId, useRef, useState, useEffect } from 'react'
import { Flex } from '../../atoms/Flex'
import { LayerItemCollapse } from './LayerItemCollapse'
import { LayerItemField } from './LayerItemField'
import { LayerItemIcon } from './LayerItemIcon'
import { Draggable } from '../Draggable'
import { useCall, useForceUpdate } from '../../atoms'
import type { ReactNode } from 'react'
import type { DragState } from '../../atoms'
import type { PLObject } from 'plre/types'

export interface LayerItemHandlers {
        mount(obj: PLObject, id: string): void
        clean(obj: PLObject, id: string): void
        click(obj: PLObject): void
        draging(obj: PLObject, drag: DragState): void
        dragend(obj: PLObject, drag: DragState): void
}
export interface LayerItemProps {
        obj: PLObject
        children?: ReactNode
        index?: number
        active?: boolean
        disable?: boolean
        handlers: LayerItemHandlers
}

export const LayerItem = (props: LayerItemProps) => {
        const { children, obj, index = 0, active, disable, handlers } = props
        const id = useId()
        const ref = useRef<HTMLDivElement | null>(null)
        const withChildren = !!children
        const [isOpen, setIsOpen] = useState(withChildren)

        useEffect(() => setIsOpen(withChildren), [withChildren])

        const handleClickCollapse = useCall(() => setIsOpen((p) => !p))

        const handleDraging = useCall((drag: DragState) => {
                handlers.draging(obj, drag)
        })

        const handleDragEnd = useCall((drag: DragState) => {
                handlers.dragend(obj, drag)
        })

        const handleChange = useCall((value: string) => {
                if (!value) value = 'Object'
                obj.id = value
                // @ts-ignore
                obj.forceUpdate()
        })

        const forceUpdate = useForceUpdate()

        const effect = useCall(() => {
                if (!ref.current) return
                const click = () => handlers.click(obj)
                // since can not do hover event when dragging
                ref.current.setAttribute('data-id', id)
                ref.current.addEventListener('click', click)
                handlers.mount(obj, id)
                // @ts-ignore
                obj({ forceUpdate })
                return () => handlers.clean(obj, id)
        })

        useEffect(() => {
                return effect()
        }, [effect])

        const left = 8 + (index === 0 ? 0 : (index - 1) * 20)
        const background = active ? '#2B4E84' : disable ? '#000' : ''

        return (
                <div
                        style={{
                                width: '100%',
                                display: 'relative',
                                overflowX: 'visible',
                                overflowY: 'visible',
                        }}
                >
                        <Flex
                                ref={ref}
                                row
                                justifyContent="start"
                                alignItems="start"
                                height="20px"
                                background={background}
                                paddingLeft={left + 'px'}
                                overflowX="visible"
                                overflowY="visible"
                        >
                                {/* <div style={{ color: 'red' }}>
                                        {!obj.parent && 'NO PARENT'}
                                </div> */}
                                <LayerItemCollapse
                                        index={index}
                                        isOpen={isOpen}
                                        onClick={handleClickCollapse}
                                />
                                <LayerItemIcon active={active}>
                                        <div data-id={id}>{obj.type?.[0]}</div>
                                </LayerItemIcon>
                                <LayerItemField
                                        value={obj.id}
                                        onChange={handleChange}
                                >
                                        <Draggable
                                                onDraging={handleDraging}
                                                onDragEnd={handleDragEnd}
                                        >
                                                <div data-id={id}>{obj.id}</div>
                                        </Draggable>
                                </LayerItemField>
                        </Flex>
                        <div
                                style={{
                                        height: isOpen ? 'auto' : '0px',
                                        overflow: isOpen ? 'visible' : 'hidden',
                                }}
                        >
                                {children}
                        </div>
                </div>
        )
}
