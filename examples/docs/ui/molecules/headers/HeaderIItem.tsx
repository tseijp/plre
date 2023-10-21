import * as React from 'react'
import { useHoverEvent } from '../../atoms'

export interface HeaderItemProps {
        onClick?: () => void
        children: React.ReactNode
}
export const HeaderItem = (props: HeaderItemProps) => {
        const { onClick, children } = props
        const [backgroundColor, set] = React.useState('transparent')
        const hover = useHoverEvent((state) => {
                set(state.active ? 'rgba(255,255,255,0.1)' : 'transparent')
        })
        return (
                <div
                        ref={hover.ref}
                        onClick={onClick}
                        style={{
                                gap: '0.5rem',
                                width: '100%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.25rem 0.5rem',
                                backgroundColor,
                        }}
                >
                        {children}
                </div>
        )
}
