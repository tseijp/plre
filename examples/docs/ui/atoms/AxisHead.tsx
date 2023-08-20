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
                                        background: color,
                                        borderRadius: 9999,
                                        width: s,
                                        height: s,
                                        fontSize: s * 0.8,
                                        textAlign: 'center',
                                        lineHeight: 'normal',
                                }}
                        >
                                {X}
                        </div>
                </div>
        )
})
