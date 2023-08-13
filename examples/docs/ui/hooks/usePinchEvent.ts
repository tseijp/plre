import { useState } from 'react'
import { event } from 'reev'
import { Vec2, addV, subV } from './utils'
import type { EventState } from 'reev'

interface PinchState {
        target: Element
        move: any
        on: <E = EventState<PinchState>>(self: E) => void
        mount(el: Element): void
        clean(el?: null): void
        ref(el: Element | null): void
}

const pinchEvent = () => {
        const self = event({
                move(e: Event) {
                        console.log(e)
                },
                mount(el: Element) {
                        self.target = el
                        el.addEventListener('touchmove', self.move)
                },
                clean() {
                        const el = self.target
                        el.removeEventListener('touchmove', self.move)
                },
                ref(el: Element | null) {
                        if (el) self.mount(el)
                        else self.clean()
                },
        }) as EventState<PinchState>
        return self
}

export const usePinchEvent = (
        on: <E = EventState<PinchState>>(self: E) => void
) => {
        const [self] = useState(pinchEvent)
        self.on = on
        return self
}
