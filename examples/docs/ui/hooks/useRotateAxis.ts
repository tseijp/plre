import { useEffect } from 'react'
import { useCallback } from './useCallback'
import { range } from '../utils'
import type { Refs } from './useRefs'
import type { WheelState } from './useWheelEvent'
import type { DragState } from './useDragEvent'
import { EventState } from 'reev'

const { PI } = Math

export const useRotateAxis = (
        refs: Refs,
        wheel: EventState<WheelState>,
        drag: EventState<DragState>
) => {
        const on = useCallback(() => {
                if (!wheel.memo) return
                let { tht, phi } = wheel.memo
                tht -= PI / 2
                // @ts-ignore
                drag.target.style.transform = `rotateX(${tht}rad) rotateY(${phi}rad)`
                range(6).forEach((i) => {
                        const el = refs[i]?.current as any
                        if (el)
                                el.style.transform = `rotateY(${-phi}rad) rotateX(${-tht}rad)`
                })
                range(3).forEach((i) => {
                        const el = refs[6 + i]?.current as any
                        const X = ['X', 'Y', 'Z'][i]
                        const rad = [-phi, -tht, 0][i]
                        if (el) el.style.transform = `rotate${X}(${rad}rad)`
                })
        })
        useEffect(() => {
                on()
                wheel({ on })
                return () => {
                        wheel({ on })
                }
        }, [])
}
