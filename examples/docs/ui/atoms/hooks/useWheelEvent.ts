import { useState, useEffect } from 'react'
import event from 'reev'
import { useCall } from '..'
import { Vec2, addV, wheelValues } from '../../molecules/hooks/utils'
import type { EventState } from 'reev/types'

export interface WheelState<El extends Element = Element> {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: El
        e: WheelEvent
        wheel(e: WheelEvent): void
        end(e: WheelEvent): void
        mount(target: Element): void
        clean(target: null): void
        ref(traget: Element): void
        scroll: () => void
        on(self: WheelState<El>): void
        memo: any
}

export const wheelEvent = <El extends Element = Element>() => {
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
                mount(target: El) {
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
        }) as EventState<WheelState<El>>

        return self
}

export const useWheelEvent = <El extends Element = Element>(
        _on: (self: WheelState<El>) => void
) => {
        const [self] = useState(wheelEvent<El>)
        const on = useCall(_on)
        useEffect(() => {
                self({ on })
                return () => {
                        self({ on })
                }
        })
        return self
}
