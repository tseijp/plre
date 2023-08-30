import React from 'react'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Arrow } from './Arrow'

export interface DropProps extends CSSProperties {
        isOpen?: boolean
        children?: ReactNode
}

export const Drop = (props: DropProps) => {
        const { children, ...other } = props
        const [isOpen, setIsOpen] = useState(false)

        if (!Array.isArray(children)) return null

        return (
                <div
                        tabIndex={'0' as unknown as number}
                        onBlur={() => setIsOpen(false)}
                        style={{ position: 'relative', lineHeight: 0 }}
                >
                        <div
                                onClick={() => setIsOpen((p) => !p)}
                                style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        padding: '0 2px',
                                        alignItems: 'center',
                                        userSelect: 'none',
                                        lineHeight: 'normal',
                                        background: '#282828',
                                        borderRadius: '4px',
                                        border: '1px solid #3D3D3D',
                                        justifyContent: 'center',
                                        ...other,
                                }}
                        >
                                {children[0]}
                                <Arrow fontSize="7px" />
                        </div>
                        <div
                                style={{
                                        position: 'absolute',
                                        zIndex: 100,
                                        lineHeight: 'normal',
                                        background: '#1D1D1D',
                                        display: isOpen ? 'flex' : 'none',
                                }}
                        >
                                {children[1]}
                        </div>
                </div>
        )
}
