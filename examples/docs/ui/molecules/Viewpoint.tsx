import * as React from 'react'
import { useState } from 'react'
import { useRefs, AxisHead, AxisLine, AxisTail } from '../atoms'
import { useDragEvent } from '../atoms'
import { useAxisEvent } from './hooks'
import type { EventState } from 'reev/types'
import type { WheelState } from '../atoms'
import type { ReactNode } from 'react'

export interface ViewpointProps {
        s: number
        wheel: EventState<WheelState>
}

export const Viewpoint = (props: ViewpointProps) => {
        const { s = 5, wheel } = props
        const refs = useRefs<HTMLDivElement | null>(null)

        useAxisEvent(refs, wheel)

        return (
                <Wrap ref={refs(-1)} wheel={wheel} s={s}>
                        <AxisHead x s={s} ref={refs(0)} />
                        <AxisHead y s={s} ref={refs(1)} />
                        <AxisHead z s={s} ref={refs(2)} />
                        <AxisTail x s={s} ref={refs(3)} />
                        <AxisTail y s={s} ref={refs(4)} />
                        <AxisTail z s={s} ref={refs(5)} />
                        <AxisLine x s={s} ref={refs(6)} />
                        <AxisLine y s={s} ref={refs(7)} />
                        <AxisLine z s={s} ref={refs(8)} />
                </Wrap>
        )
}

interface WrapProps {
        s: number
        wheel: EventState<WheelState>
        children: ReactNode
}

const Wrap = React.forwardRef((props: WrapProps, forwardRef) => {
        const { s, wheel, children } = props
        const [isHover, setHover] = useState(false)
        const drag = useDragEvent((state) => {
                wheel.active = state.active
                wheel._active = state._active
                if (!state.active) return
                const [dx, dy] = state.delta
                const weight = 2
                wheel.delta = [-dx * weight, -dy * weight]
                wheel.on(wheel)
        })

        return (
                <div
                        ref={drag.ref}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                                position: 'absolute',
                                top: s * 3.7,
                                left: 'initial',
                                right: 0.5,
                                color: 'black',
                                borderRadius: '9999px',
                                background: isHover ? '#636363' : '',
                                fontSize: s,
                        }}
                >
                        <div
                                // @ts-ignore
                                ref={forwardRef}
                                style={{
                                        width: s * 6,
                                        height: s * 6,
                                        transformStyle: 'preserve-3d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                }}
                        >
                                {children}
                        </div>
                </div>
        )
})
