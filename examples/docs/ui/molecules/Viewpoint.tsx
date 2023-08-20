import * as React from 'react'
import { useEffect, useState, forwardRef } from 'react'
import { quat, mat4 } from 'gl-matrix'
import { useRefs } from '../hooks/useRefs'
import { useCallback } from '../hooks/useCallback'
import { useDragEvent } from '../hooks/useDragEvent'
import { AxisHead } from '../atoms/AxisHead'
import { AxisLine } from '../atoms/AxisLine'
import { AxisTail } from '../atoms/AxisTail'
import type { EventState } from 'reev/types'
import type { WheelState } from '../hooks/useWheelEvent'
import type { FlexProps } from '../atoms/Flex'
import type { ReactNode, CSSProperties } from 'react'
import { range } from '../utils'

export interface ViewpointProps extends FlexProps {
        s: number
        wheel: EventState<WheelState>
}

export const Viewpoint = (props: ViewpointProps) => {
        const { s = 5, wheel, ...other } = props
        const refs = useRefs()
        const [_] = useState(() => ({
                rot: quat.create(),
                mat: mat4.create(),
                inv: mat4.create(),
        }))

        const rotate = () => {
                // @ts-ignore
                drag.target.style.transform = 'matrix3d(' + _.mat + ')'
                range(6).forEach((i) => {
                        const el = refs[i]?.current as any
                        if (el) el.style.transform = 'matrix3d(' + _.inv + ')'
                })
        }

        const on = useCallback((state) => {
                if (!state.active) return
                const [dx, dy] = state.delta
                if (state.e.ctrlKey) return
                let tmp = quat.create()
                quat.rotateX(tmp, tmp, dy / 200)
                quat.rotateY(tmp, tmp, -dx / 200)
                quat.multiply(_.rot, tmp, _.rot)
                mat4.fromQuat(_.mat, _.rot)
                mat4.invert(_.inv, _.mat)
                rotate()
        })

        const drag = useDragEvent(() => {})

        useEffect(() => {
                rotate()
                wheel({ on })
                return () => {
                        wheel({ on })
                }
        }, [])

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

interface WrapProps extends CSSProperties {
        s: number
        children: ReactNode
}

const Wrap = forwardRef((props: WrapProps, ref) => {
        const { s, children, ...other } = props
        return (
                <div // @ts-ignore
                        ref={ref}
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
                                transformStyle: 'preserve-3d',
                                ...other,
                        }}
                >
                        {children}
                </div>
        )
})
