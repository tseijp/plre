import React from 'react'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Arrow } from './Arrow'
import { useCall } from './hooks'
import { Button } from './Button'

export interface DropProps extends CSSProperties {
        isOpen?: boolean
        children?: ReactNode
}

export const Drop = (props: DropProps) => {
        const { children, ...other } = props
        const [isOpen, setIsOpen] = useState(false)

        if (!Array.isArray(children)) return null

        const handleClick = useCall(() => {
                setIsOpen(false)
        })

        return (
                <div
                        tabIndex={'0' as unknown as number}
                        onBlur={() => setIsOpen(false)}
                        style={{ position: 'relative', lineHeight: 0 }}
                >
                        <Button
                                paddingRight="5px"
                                lineHeight="18px"
                                onClick={() => setIsOpen((p) => !p)}
                                {...other}
                        >
                                {children[0]}
                                <Arrow marginLeft="1px" fontSize="7px" />
                        </Button>
                        <div
                                style={{
                                        position: 'absolute',
                                        zIndex: 100,
                                        lineHeight: 'normal',
                                        backdropFilter: 'blur(1px)',
                                        borderRadius: 5,
                                        backgroundColor:
                                                'rgba(61, 61, 61, 0.75)',
                                        display: isOpen ? 'flex' : 'none',
                                }}
                                onClick={handleClick}
                        >
                                {children[1]}
                        </div>
                </div>
        )
}
