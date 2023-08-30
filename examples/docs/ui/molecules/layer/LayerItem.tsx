import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Flex } from '../../atoms/Flex'
import { LayerItemCollapse } from './LayerItemCollapse'
import { LayerItemField } from './LayerItemField'
import { LayerItemIcon } from './LayerItemIcon'
import type { ReactNode } from 'react'

export interface LayerItemProps {
        children?: ReactNode
        grand?: ReactNode
        icon?: ReactNode
        index?: number
        active?: boolean
        onClick?(): void
}

export const LayerItem = (props: LayerItemProps) => {
        const { children, grand, icon, index = 0, active, onClick } = props
        const [isOpen, setIsOpen] = useState(!!grand)
        const ref = useRef<HTMLDivElement | null>(null)

        const handleClickCollapse = () => {
                setIsOpen((p) => !p)
        }

        useEffect(() => {
                ref.current?.addEventListener('click', onClick)
                return () => {
                        ref.current?.removeEventListener('click', onClick)
                }
        })

        const left = 8 + (index === 0 ? 0 : (index - 1) * 20)

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
                                background={active && '#2B4E84'}
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
                                        {icon}
                                </LayerItemIcon>
                                <LayerItemField>{children}</LayerItemField>
                        </Flex>
                        <div
                                style={{
                                        height: isOpen ? 'auto' : '0px',
                                        overflow: isOpen ? 'visible' : 'hidden',
                                }}
                        >
                                {grand}
                        </div>
                </div>
        )
}
