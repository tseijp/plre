import * as React from 'react'
import { forwardRef } from 'react'

export interface AxisHeadProps {
        x?: boolean
        y?: boolean
        z?: boolean
        s: number
}

export const AxisHead = forwardRef((props: AxisHeadProps, ref) => {
        const { x, y, s } = props
        const X = x ? 'X' : y ? 'Y' : 'Z'
        const color = x ? 'red' : y ? 'blue' : 'green'
        return (
                <div
                        style={{
                                position: 'absolute',
                                transform: `translate${X}(${
                                        s * 5 * (y ? -1 : 1)
                                }px)`,
                                transformStyle: 'preserve-3d',
                        }}
                >
                        <div
                                ref={ref as any}
                                style={{
                                        background: color,
                                        borderRadius: 9999,
                                        width: s,
                                        height: s,
                                        textAlign: 'center',
                                        lineHeight: 'normal',
                                }}
                        >
                                {X}
                        </div>
                </div>
        )
})
