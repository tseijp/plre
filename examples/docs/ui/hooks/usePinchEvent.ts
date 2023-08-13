import { useState, useEffect } from 'react'
import { useCallback } from './useCallback'
import { event } from 'reev'
import type { EventState } from 'reev'

export interface PinchState {
        target: Element
        move: any
        on: (self: PinchState) => void
        mount(el: Element): void
        clean(el?: null): void
        ref(el: Element | null): void
}

export const pinchEvent = () => {
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

export const usePinchEvent = (_on: (self: PinchState) => void) => {
        const [self] = useState(pinchEvent)
        const on = useCallback(_on)

        useEffect(() => {
                self({ on })
                return () => void self({ on })
        }, [])

        return self
}
