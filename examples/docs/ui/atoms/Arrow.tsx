import * as React from 'react'
import type { CSSProperties } from 'react'

export interface ArrowProps extends CSSProperties {
        w?: boolean
        a?: boolean
        d?: boolean
        s?: boolean
}

export const Arrow = React.forwardRef((props: ArrowProps, ref) => {
        let { w, a, d, s, transform = '', ...other } = props

        if (w) transform += ' rotate(180deg)'
        if (a) transform += ' rotate(90deg)'
        if (d) transform += ' rotate(-90deg)'
        if (s) transform += ' rotate(0deg)'

        return (
                <span
                        ref={ref as any}
                        style={{
                                position: 'relative',
                                width: '1em',
                                height: '1em',
                                transform,
                                ...other,
                        }}
                >
                        <span
                                style={{
                                        content: '',
                                        width: '0.7em', // 1 / sqrt(2)
                                        height: '0.7em', // 1 / sqrt(2)
                                        border: '1px solid currentColor',
                                        borderTop: 0,
                                        borderRight: 0,
                                        transform: 'rotate(-45deg)',
                                        transformOrigin: 'center center',
                                        position: 'absolute',
                                        boxSizing: 'border-box',
                                }}
                        />
                </span>
        )
})
