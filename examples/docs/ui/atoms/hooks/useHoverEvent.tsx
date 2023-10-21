import event, { EventState } from 'reev'
import { Vec2, addV, subV } from './utils'
import { useEffect, useState } from 'react'
import { useCall } from '.'

export interface HoverState<El extends Element = Element> {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        event: PointerEvent
        target: El
        on: (self: HoverState) => void
        enter(e: PointerEvent): void
        move(e: PointerEvent): void
        leave(e: PointerEvent): void
        mount(target: El): void
        clean(target?: El): void
        ref(target: El | null): void
}

export const hoverEvent = <El extends Element = Element>() => {
        const self = event({
                on: () => {},
                move(e: PointerEvent) {
                        self.event = e
                        self._active = self.active
                        self._value = self.value
                        self.value = [e.clientX, e.clientY]
                        if (self._active) {
                                self.delta = subV(self.value, self._value)
                                self.offset = addV(self.offset, self.delta)
                                self.movement = addV(self.movement, self.delta)
                        }
                        self.on(self)
                },
                enter(e: PointerEvent) {
                        self.event = e
                        self._active = false
                        self.active = true
                        self.on(self)
                },
                leave(e: PointerEvent) {
                        self.event = e
                        self._active = true
                        self.active = false
                        self.on(self)
                        self.delta = self.movement = [0, 0]
                },
                mount(target: El) {
                        self.target = target
                        self.active = self._active = false
                        self.value = self._value = [0, 0]
                        self.delta = self.offset = self.movement = [0, 0]
                        target.addEventListener('pointerenter', self.enter)
                        target.addEventListener('pointermove', self.move)
                        target.addEventListener('pointerleave', self.leave)
                },
                clean(target: El) {
                        if (!target) return
                        target.removeEventListener('pointermove', self.move)
                        target.removeEventListener('pointerleave', self.leave)
                },
                ref(target: El | null) {
                        if (target) self.mount(target)
                        else self.clean()
                },
        }) as EventState<HoverState<El>>

        return self
}

export const useHoverEvent = <El extends Element = Element>(
        _on: (self: HoverState<El>) => void
) => {
        const [self] = useState(hoverEvent<El>)
        const on = useCall(_on)
        useEffect(() => {
                self({ on })
                return () => void self({ on })
        })

        return self
}
