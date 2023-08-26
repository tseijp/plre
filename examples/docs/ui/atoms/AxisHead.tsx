import * as React from 'react'
import { forwardRef } from 'react'

export interface AxisHeadProps {
        x?: boolean
        y?: boolean
        z?: boolean
        s: number
}

export const HEAD_POS = 2

export const AxisHead = forwardRef((props: AxisHeadProps, ref) => {
        const { x, y, s } = props
        const X = x ? 'X' : y ? 'Y' : 'Z'
        const color = x ? 'red' : y ? 'blue' : 'green'
        return (
                <div
                        style={{
                                position: 'absolute',
                                transformStyle: 'preserve-3d',
                                transform: `translate${X}(${
                                        s * (y ? -1 : 1) * HEAD_POS
                                }px)`,
                        }}
                >
                        <div
                                ref={ref as any}
                                style={{
                                        color: 'black',
                                        background: color,
                                        borderRadius: 9999,
                                        width: s,
                                        height: s,
                                        textAlign: 'center',
                                        fontSize: s * 0.7,
                                        lineHeight: 1 / 0.7,
                                        fontWeight: 500,
                                        userSelect: 'none',
                                }}
                        >
                                {X}
                        </div>
                </div>
        )
})
