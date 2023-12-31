import * as React from 'react'
import { useId, useRef, useState, useEffect } from 'react'
import { Flex } from '../../atoms/Flex'
import { LayerItemCollapse } from './LayerItemCollapse'
import { LayerItemField } from './LayerItemField'
import { LayerItemIcon } from './LayerItemIcon'
import { Draggable } from '../../molecules/Draggable'
import { useCall, useForceUpdate } from '../../atoms'
import { OBJECT_ICONS } from '../../atoms'
import type { ReactNode } from 'react'
import type { DragState } from '../../atoms'
import type { ObjectState } from 'plre/types'

export interface LayerItemHandlers {
        mount(obj: ObjectState, id: string): void
        clean(obj: ObjectState, id: string): void
        click(obj: ObjectState): void
        draging(obj: ObjectState, drag: DragState): void
        dragend(obj: ObjectState, drag: DragState): void
}

export interface LayerItemProps {
        obj: ObjectState
        children?: ReactNode
        index?: number
        active?: boolean
        disable?: boolean
        handlers: LayerItemHandlers
}

let isDev = false
// isDev = process.env.NODE_ENV === 'development'
const display = isDev ? '' : 'none'

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
                obj.forceUpdate?.()
                // connect
                obj.memo.ymap.set('id', value)
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

        // debug
        const { memo: _ = {} } = obj

        const Icon = OBJECT_ICONS[obj.type]

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
                                <LayerItemCollapse
                                        index={index}
                                        isOpen={isOpen}
                                        onClick={handleClickCollapse}
                                />
                                <LayerItemIcon active={active}>
                                        <div data-id={id}>
                                                {Icon && <Icon />}
                                        </div>
                                </LayerItemIcon>
                                <LayerItemField
                                        isEditted={obj.isEditted}
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
                                <div
                                        style={{
                                                color: 'red',
                                                marginLeft: '5rem',
                                        }}
                                >
                                        {!_.ydoc || !_.ymap || !_.yarr
                                                ? 'Error: '
                                                : ''}
                                        {!_.ydoc && 'NO Y.Doc '}
                                        {!_.ymap && 'NO Y.Arr '}
                                        {!_.yarr && 'NO Y.Map '}
                                </div>
                                <div
                                        style={{
                                                display,
                                                color: '#e2e2e2',
                                                marginLeft: '5rem',
                                        }}
                                >
                                        {_._init ? ' Init:' + _._init : ' '}
                                        {_._pub ? ' Pub:' + _._pub : ' '}
                                        {_._del ? ' Del:' + _._del : ' '}
                                        {_._sub ? ' Sub:' + _._sub : ' '}
                                </div>
                                <div style={{ marginLeft: '5rem', display }}>
                                        {_.ymap
                                                ? 'YMap:' + _.ymap?.size + ' '
                                                : ''}
                                        {_.yarr
                                                ? 'YArr:' + _.yarr?.size + ' '
                                                : ''}
                                </div>
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
