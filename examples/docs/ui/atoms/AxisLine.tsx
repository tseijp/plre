import * as React from 'react'
import { forwardRef } from 'react'
import { HEAD_POS } from './AxisHead'
export interface AxisLineProps {
        x?: boolean
        y?: boolean
        z?: boolean
        s: number
}

const LINE_WIDTH = HEAD_POS * 0.8

const LINE_HEIGHT = 0.2

export const AxisLine = forwardRef((props: AxisLineProps, ref) => {
        const { x, y, z, s } = props
        const X = x ? 'X' : y ? 'Y' : 'Z'
        const color = x ? 'red' : y ? 'blue' : 'green'
        return (
                <div
                        style={{
                                position: 'absolute',
                                transformStyle: 'preserve-3d',
                                transform:
                                        `translate${X}(${
                                                s *
                                                (x ? 1 : -1) *
                                                LINE_WIDTH *
                                                0.5
                                        }px)` + (z ? ' rotateX(90deg)' : ''),
                        }}
                >
                        <div
                                ref={ref as any}
                                style={{
                                        perspective: '1000px',
                                        background: color,
                                        width: x
                                                ? s * LINE_WIDTH
                                                : s * LINE_HEIGHT,
                                        height: x
                                                ? s * LINE_HEIGHT
                                                : s * LINE_WIDTH,
                                }}
                        />
                </div>
        )
})
