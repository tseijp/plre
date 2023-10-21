import * as React from 'react'
import { useHoverEvent } from '../../atoms'

export interface HeaderButtonProps {
        children: React.ReactNode
}

export const HeaderButton = (props: HeaderButtonProps) => {
        const { children } = props
        const [backgroundColor, set] = React.useState('transparent')
        const hover = useHoverEvent((state) => {
                set(state.active ? 'rgba(255,255,255,0.1)' : 'transparent')
        })
        return (
                <span
                        ref={hover.ref}
                        style={{
                                display: 'flex',
                                height: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 0.25rem',
                                textAlign: 'center',
                                backgroundColor,
                        }}
                >
                        {children}
                </span>
        )
}
