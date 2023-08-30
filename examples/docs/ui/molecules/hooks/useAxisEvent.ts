import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Refs } from '../../atoms'
import { range, rot } from '../../utils'
import { EventState, event } from 'reev'
import { useCallback } from '../../atoms'
import { WheelState } from './useWheelEvent'

const { PI } = Math

// prettier-ignore
const THT_PHI = [
        {tht: PI / 2, phi: -PI / 2}, // X
        {tht: 0.0001, phi:       0}, // Y
        {tht: PI / 2, phi:       0}, // Z
        {tht: PI / 2, phi:  PI / 2}, // -X
        {tht: PI    , phi:       0}, // -Y
        {tht: PI / 2, phi:      PI}, // -Z
]

const addClick = (
        el: HTMLDivElement,
        wheel: EventState<WheelState>,
        i: number
) => {
        const click = () => {
                if (wheel.active && wheel._active) return
                const index = wheel.memo.lastIndex === i ? (i + 3) % 6 : i
                wheel.memo.lastIndex = index
                const { tht, phi } = rot(wheel.memo, THT_PHI[index])
                const onUpdate = () => wheel.on(wheel)
                gsap.to(wheel.memo, { tht, phi, onUpdate })
        }
        el.addEventListener('mousedown', click)
        return () => {
                el.removeEventListener('mousedown', click)
        }
}

const addHover = (el: HTMLDivElement, color: string) => {
        const enter = () => (el.style.color = 'white')
        const leave = () => (el.style.color = color)
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
        return () => {
                el.removeEventListener('mouseenter', enter)
                el.removeEventListener('mouseleave', leave)
        }
}

interface AxisState {
        hover(): void
        mount(): void
        clean(): void
}

const axisEvent = (
        refs: Refs<HTMLDivElement | null>,
        wheel: EventState<WheelState>
) => {
        const self = event<AxisState>({
                mount() {
                        range(3).map((i) => {
                                const el = refs[i].current
                                if (!(el instanceof HTMLDivElement)) return
                                self('clean', addClick(el, wheel, i))
                                self('clean', addHover(el, 'black'))
                        })
                        range(3).map((i) => {
                                const el = refs[i + 3].current
                                if (!(el instanceof HTMLDivElement)) return
                                self('clean', addClick(el, wheel, i + 3))
                                self('clean', addHover(el, 'transparent'))
                        })
                },
        })

        return self
}

export const useAxisEvent = (
        refs: Refs<HTMLDivElement | null>,
        wheel: EventState<WheelState>
        // ref: RefObject<HTMLDivElement>
) => {
        const [self] = useState(() => axisEvent(refs, wheel))
        const on = useCallback(() => {
                if (!wheel.memo) return
                let { tht, phi } = wheel.memo
                let wrap = refs[-1].current
                tht -= PI / 2
                wrap.style.transform = `rotateX(${tht}rad) rotateY(${phi}rad)`
                range(6).forEach((i) => {
                        const el = refs[i]?.current
                        if (el)
                                el.style.transform = `rotateY(${-phi}rad) rotateX(${-tht}rad)`
                })
                range(3).forEach((i) => {
                        const el = refs[6 + i]?.current
                        const X = ['X', 'Y', 'Z'][i]
                        const rad = [-phi, -tht, 0][i]
                        if (el) el.style.transform = `rotate${X}(${rad}rad)`
                })
        })

        useEffect(() => {
                on(wheel)
                wheel({ on })
                self.mount()
                return () => {
                        wheel({ on })
                        self.clean()
                }
        }, [])
}
