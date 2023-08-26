import { useEffect, useState } from 'react'
import { gsap } from 'gsap/gsap-core'
import { Refs } from './useRefs'
import { range } from '../utils'
import { EventState, event } from 'reev'
import { WheelState } from './useWheelEvent'

const { PI } = Math

// prettier-ignore
const THT_PHI = [
        [PI / 2, -PI / 2], // X
        [0.0001,       0], // Y
        [PI / 2,       0], // Z
        [PI / 2,  PI / 2], // -X
        [PI    ,       0], // -Y
        [PI / 2,      PI], // -Z
]

const addClick = (
        el: HTMLDivElement,
        wheel: EventState<WheelState>,
        index: number
) => {
        const click = () => {
                const i =
                        wheel.memo.lastIndex === index ? (index + 3) % 6 : index
                wheel.memo.lastIndex = i
                let [tht, phi] = THT_PHI[i]
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
                alert('HI')
                el.removeEventListener('mouseenter', enter)
                el.removeEventListener('mouseleave', leave)
        }
}

interface AxisState {
        hover(): void
        mount(): void
        clean(): void
}

const axisEvent = (refs: Refs, wheel: EventState<WheelState>) => {
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

export const useAxisEvent = (refs: Refs, wheel: EventState<WheelState>) => {
        const [self] = useState(() => axisEvent(refs, wheel))
        useEffect(() => void self.mount(), [])
        useEffect(() => () => self.clean(), [])
}
