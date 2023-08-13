import { useState } from 'react'
import event from 'reev'
import { Vec2, addV, wheelValues } from './utils'
import type { EventState } from 'reev/types'

interface WheelState {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: Element
        e: WheelEvent
        wheel(e: WheelEvent): void
        end(e: WheelEvent): void
        mount(target: Element): void
        clean(target: null): void
        ref(traget: Element): void
        scroll: () => void
        on(self: WheelState): void
}

const wheelEvent = () => {
        const self = event({
                active: false,
                _active: false,
                value: [0, 0],
                _value: [0, 0],
                delta: [0, 0],
                offset: [0, 0],
                movement: [0, 0],
                wheel(e: WheelEvent) {
                        e.preventDefault()
                        self.e = e
                        self._active = self.active
                        self._value = self.value
                        self.active = true
                        self.delta = wheelValues(e)
                        if (self._active) {
                                self.offset = addV(self.offset, self.delta)
                                self.movement = addV(self.movement, self.delta)
                        }
                        const id = setTimeout(self.end, 1000)
                        const scroll = () => {
                                self({ scroll })
                                clearTimeout(id)
                        }
                        self({ scroll })
                        self.on(self)
                },
                end(_e: WheelEvent) {
                        self._active = !(self.active = false)
                        self.delta = self.movement = [0, 0]
                        self.on(self)
                },
                mount(target: Element) {
                        self.target = target
                        target.addEventListener('wheel', self.wheel)
                },
                clean() {
                        const target = self.target
                        target.removeEventListener('wheel', self.wheel)
                },
                ref(target: Element | null) {
                        if (target) self.mount(target)
                },
        }) as EventState<WheelState>

        return self
}

export const useWheelEvent = (on: (self: WheelState) => void) => {
        const [self] = useState(wheelEvent)
        self.on = on
        return self
}
