import * as React from 'react'
import { forwardRef } from 'react'

export interface AxisLineProps {
        x?: boolean
        y?: boolean
        z?: boolean
        s: number
}

export const AxisLine = forwardRef((props: AxisLineProps, ref) => {
        const { x, y, z, s } = props
        const X = x ? 'X' : y ? 'Y' : 'Z'
        const color = x ? 'red' : y ? 'blue' : 'green'
        return (
                <div
                        style={{
                                position: 'absolute',
                                transform:
                                        `translate${X}(${
                                                s * 2.5 * (y ? -1 : 1)
                                        }px)` + (z ? ' rotateX(90deg)' : ''),
                                transformStyle: 'preserve-3d',
                        }}
                >
                        <div
                                ref={ref as any}
                                style={{
                                        perspective: '1000px',
                                        background: color,
                                        width: x ? s * 5 : s / 5,
                                        height: x ? s / 5 : s * 5,
                                }}
                        />
                </div>
        )
})
