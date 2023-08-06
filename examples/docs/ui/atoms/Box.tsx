import { ReactNode, CSSProperties, createElement, forwardRef } from 'react'

export interface BoxProps extends CSSProperties {
        children?: ReactNode
        style?: CSSProperties
        as?: any
        grow?: number
        shrink?: number
        basis?: CSSProperties['flexBasis']
}

export const Box = forwardRef((props: BoxProps, ref) => {
        const {
                children,
                as = 'div',
                grow: flexGrow = 1,
                shrink: flexShrink = 1,
                basis: flexBasis = 'auto',
                gap = 0,
                top = 0,
                left = 0,
                width = '100%',
                height = '100%',
                cursor = 'default',
                margin = 0,
                padding = 0,
                position = 'relative',
                boxSizing = 'border-box',
                overflowX = 'hidden',
                overflowY = 'hidden',
                alignItems = 'center',
                borderRadius = 5,
                flexDirection = 'column',
                justifyContent = 'center',
                ...other
        } = props

        const style = {
                gap,
                top,
                left,
                width,
                height,
                cursor,
                margin,
                padding,
                position,
                boxSizing,
                overflowX,
                overflowY,
                flexGrow,
                flexBasis,
                flexShrink,
                alignItems,
                borderRadius,
                justifyContent,
                ...other,
        }

        return createElement(as, { ref, style }, children)
})
