import * as React from 'react'
import { forwardRef, createElement as el } from 'react'
export interface ButtonProps extends React.CSSProperties {
        as?: any
        children?: React.ReactNode
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
        onDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
        onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
        onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Button = forwardRef((props: ButtonProps, ref: any) => {
        const {
                children,
                as = 'div',
                onClick,
                onDoubleClick,
                onMouseEnter,
                onMouseLeave,
                cursor = 'pointer',
                display = 'flex',
                margin = 0,
                padding = 0,
                alignItems = 'center',
                justifyContent = 'center',
                userSelect = 'none',
                lineHeight = 'normal',
                background = '#282828',
                borderRadius = '4px',
                border = '1px solid #3D3D3D',
                textDecoration = 'none',
                color = '#fff',
                ...other
        } = props

        const style = {
                cursor,
                display,
                margin,
                padding,
                alignItems,
                justifyContent,
                userSelect,
                lineHeight,
                background,
                borderRadius,
                border,
                textDecoration,
                color,
                ...other,
        }

        return el(
                as,
                {
                        ref,
                        style,
                        onClick,
                        onDoubleClick,
                        onMouseEnter,
                        onMouseLeave,
                },
                children
        )
})
