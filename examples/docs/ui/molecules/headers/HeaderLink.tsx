import * as React from 'react'
import { Button, useHoverEvent } from '../../atoms'

export interface HeaderLinkProps {
        onClick(): void
        children: React.ReactNode
}

export const HeaderLink = (props: HeaderLinkProps) => {
        const { children, onClick } = props
        const [color, setColor] = React.useState('white')
        const [background, setBackground] = React.useState('transparent')
        const hover = useHoverEvent((state) => {
                setBackground(
                        state.active ? 'rgba(255,255,255,0.1)' : 'transparent'
                )
                setColor(state.active ? '#3372DB' : 'white')
        })

        return (
                <Button
                        ref={hover.ref}
                        fontSize="16px"
                        padding="0 3px"
                        color={color}
                        backgroundColor={background}
                        onClick={onClick}
                >
                        {children}
                </Button>
        )
}
