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
        const rgba = x
                ? 'rgba(255, 0, 0, 0.1)'
                : y
                ? 'rgba(0, 0, 255, 0.1)'
                : 'rgba(0, 255, 0, 0.1)'
        return (
                <div
                        style={{
                                position: 'absolute',
                                transformStyle: 'preserve-3d',
                                transform: `translate${X}(${
                                        s * (y ? 1 : -1) * HEAD_POS
                                }px)`,
                        }}
                >
                        <div
                                ref={ref as any}
                                style={{
                                        background: rgba,
                                        borderRadius: 9999,
                                        boxSizing: 'border-box',
                                        border: `solid ${s / 10}px ${color}`,
                                        width: s,
                                        height: s,
                                }}
                        />
                </div>
        )
})
