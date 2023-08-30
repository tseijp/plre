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
        const rgba = x ? '#493B3D' : y ? '#35485A' : '#4D652A'
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
                                // @ts-ignore
                                ref={ref}
                                style={{
                                        color: 'transparent',
                                        background: rgba,
                                        borderRadius: 9999,
                                        width: s,
                                        height: s,
                                        textAlign: 'center',
                                        fontSize: s * 0.7,
                                        lineHeight: 1 / 0.7,
                                        fontWeight: 500,
                                        userSelect: 'none',
                                        boxSizing: 'border-box',
                                        outline: `solid ${s / 10}px ${color}`,
                                }}
                        >
                                -{X}
                        </div>
                </div>
        )
})
