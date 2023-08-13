import * as React from 'react'
import { forwardRef } from 'react'
import { HEAD_POS } from './AxisHead'
export interface AxisTailProps {
        x?: boolean
        y?: boolean
        z?: boolean
        s: number
}

export const AxisTail = forwardRef((props: AxisTailProps, ref) => {
        const { x, y, s } = props
        const X = x ? 'X' : y ? 'Y' : 'Z'
        const color = x ? 'red' : y ? 'blue' : 'green'
        return (
                <div
                        style={{
                                position: 'absolute',
                                transformStyle: 'preserve-3d',
                                transform: `translate${X}(${
                                        s * (x ? -1 : 1) * HEAD_POS
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
                                }}
                        />
                </div>
        )
})
