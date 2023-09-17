import * as React from 'react'
import { useId, useRef, useState, useEffect } from 'react'
import { Flex } from '../../atoms/Flex'
import { LayerItemCollapse } from './LayerItemCollapse'
import { LayerItemField } from './LayerItemField'
import { LayerItemIcon } from './LayerItemIcon'
import { Draggable } from '../Draggable'
import type { ReactNode } from 'react'
import { DragState } from '../../atoms'

export interface LayerItemProps {
        children?: ReactNode
        icon?: ReactNode
        objId: string
        index?: number
        active?: boolean
        disable?: boolean
        onMount?(id: string): void | (() => void)
        onClick?(): void
        onDrag?(state: DragState): void
}

export const LayerItem = (props: LayerItemProps) => {
        const {
                children,
                objId,
                icon,
                index = 0,
                active,
                disable,
                onMount,
                onClick,
                onDrag,
        } = props
        const id = useId()
        const [isOpen, setIsOpen] = useState(!!children)
        const ref = useRef<HTMLDivElement | null>(null)

        const handleClickCollapse = () => {
                setIsOpen((p) => !p)
        }

        useEffect(() => {
                if (!ref.current) return
                ref.current.id = id
                // since can not do hover event when dragging
                ref.current.setAttribute('data-id', id)
                ref.current.addEventListener('click', onClick)
                return onMount(id)
        }, [])

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
                                <LayerItemCollapse
                                        index={index}
                                        isOpen={isOpen}
                                        onClick={handleClickCollapse}
                                />
                                <LayerItemIcon active={active}>
                                        <div data-id={id}>{icon}</div>
                                </LayerItemIcon>
                                <LayerItemField objId={objId}>
                                        <Draggable onDrag={onDrag}>
                                                <div data-id={id}>{objId}</div>
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
