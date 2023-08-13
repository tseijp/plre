import * as React from 'react'
import { useEffect, forwardRef } from 'react'
import { Flex } from '../atoms/Flex'
import { useRefs } from '../hooks/useRefs'
import { useCallback } from '../hooks/useCallback'
import { useDragEvent } from '../hooks/useDragEvent'
import { AxisHead } from '../atoms/AxisHead'
import { AxisLine } from '../atoms/AxisLine'
import { AxisTail } from '../atoms/AxisTail'
import type { EventState } from 'reev/types'
import type { WheelState } from '../hooks/useWheelEvent'
import type { FlexProps } from '../atoms/Flex'
import type { ReactNode } from 'react'
import { range } from '../utils'

export interface ViewpointProps extends FlexProps {
        s: number
        wheel: EventState<WheelState>
}

export const Viewpoint = (props: ViewpointProps) => {
        const { s = 5, wheel, ...other } = props
        let phi = 0.12
        let tht = 1
        const refs = useRefs()

        const rotate = () => {
                // @ts-ignore
                drag.target.style.transform = `rotateY(${tht}rad) rotateX(${phi}rad)`
                range(6).forEach((i) => {
                        const el = refs[i]?.current as any
                        if (el)
                                el.style.transform = `rotateX(${-phi}rad) rotateY(${-tht}rad)`
                })
                range(3).forEach((i) => {
                        const el = refs[6 + i]?.current as any
                        const X = ['X', 'Y', 'Z'][i]
                        const rad = [-phi, -tht, 0][i]
                        if (el) el.style.transform = `rotate${X}(${rad}rad)`
                })
        }

        const drag = useDragEvent((state) => {
                if (!state.active) return
                const [dx, dy] = state.delta
                tht -= dx / 200
                phi -= dy / 400
                rotate()
        })

        const on = useCallback((state) => {
                if (!state.active) return
                const [dx, dy] = state.delta
                if (state.e.ctrlKey) return
                tht += dx / 200
                phi -= dy / 400
                rotate()
        })

        useEffect(() => {
                wheel({ on })
                return () => {
                        wheel({ on })
                }
        }, [])

        return (
                <Flex
                        ref={wheel.ref}
                        position="absolute"
                        top={s * 3.4}
                        left="initial"
                        right={0}
                        fontSize={s}
                        width={s * 6}
                        height={s * 6}
                        {...other}
                >
                        <Wrap ref={drag.ref}>
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
                </Flex>
        )
}

const Wrap = forwardRef((props: { children: ReactNode }, ref) => {
        return (
                <div
                        {...props}
                        ref={ref as any}
                        style={{
                                display: 'flex',
                                position: 'relative',
                                background: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transformStyle: 'preserve-3d',
                        }}
                />
        )
})
