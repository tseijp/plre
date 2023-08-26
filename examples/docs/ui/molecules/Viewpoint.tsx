import * as React from 'react'
import { useRefs } from '../hooks/useRefs'
import { useAxisEvent } from '../hooks/useAxisEvent'
import { useDragEvent } from '../hooks/useDragEvent'
import { AxisHead } from '../atoms/AxisHead'
import { AxisLine } from '../atoms/AxisLine'
import { AxisTail } from '../atoms/AxisTail'
import type { EventState } from 'reev/types'
import type { WheelState } from '../hooks/useWheelEvent'
import type { ReactNode, CSSProperties } from 'react'
import { useRotateAxis } from '../hooks/useRotateAxis'

export interface ViewpointProps {
        s: number
        wheel: EventState<WheelState>
}

export const Viewpoint = (props: ViewpointProps) => {
        const { s = 5, wheel } = props
        const refs = useRefs()
        const drag = useDragEvent(() => {})

        useAxisEvent(refs, wheel)
        useRotateAxis(refs, wheel, drag)

        return (
                <Wrap ref={drag.ref} s={s}>
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
        children: ReactNode
}

const Wrap = React.forwardRef((props: WrapProps, forwardRef) => {
        const { s, children } = props
        return (
                <div // @ts-ignore
                        ref={forwardRef}
                        style={{
                                position: 'absolute',
                                top: s * 3.4,
                                left: 'initial',
                                right: 0,
                                fontSize: s,
                                width: s * 6,
                                height: s * 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'black',
                                transformStyle: 'preserve-3d',
                        }}
                >
                        {children}
                </div>
        )
})
