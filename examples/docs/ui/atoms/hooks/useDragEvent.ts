import { useState, useEffect } from 'react'
import { useCall } from '..'
import { event } from 'reev'
import { Vec2, addV, subV } from '../../molecules/hooks/utils'
import type { EventState } from 'reev'

export interface DragState<El extends Element = Element> {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: El
        move(e: PointerEvent): void
        down(e: PointerEvent): void
        up(e: PointerEvent): void
        mount(target: Element): void
        clean(): void
        ref(traget: Element): void
        on(self: DragState<El>): void
        event: PointerEvent
        memo: any
}

export const dragEvent = <El extends Element = Element>() => {
        const self = event({
                active: false,
                _active: false,
                value: [0, 0],
                _value: [0, 0],
                delta: [0, 0],
                offset: [0, 0],
                movement: [0, 0],
                memo: {},
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
                down(e: PointerEvent) {
                        self.event = e
                        self._active = false
                        self.active = true
                        self.target.setPointerCapture(e.pointerId)
                        self.on(self)
                },
                up(e: PointerEvent) {
                        self.event = e
                        self._active = true
                        self.active = false
                        self.target.releasePointerCapture(e.pointerId)
                        self.on(self)
                        self.delta = self.movement = [0, 0]
                },
                mount(target: El) {
                        self.target = target
                        target.addEventListener('pointermove', self.move)
                        target.addEventListener('pointerdown', self.down)
                        target.addEventListener('pointerleave', self.up)
                        target.addEventListener('pointerup', self.up)
                },
                clean() {
                        const target = self.target
                        target.removeEventListener('pointermove', self.move)
                        target.removeEventListener('pointerdown', self.down)
                        target.removeEventListener('pointerleave', self.up)
                        target.removeEventListener('pointerup', self.up)
                },
                ref(target: Element | null) {
                        if (target) self.mount(target)
                        else self.clean()
                },
        }) as EventState<DragState<El>>

        return self
}

export const useDragEvent = <El extends Element = Element>(
        _on: (self: DragState<El>) => void
) => {
        const [self] = useState(dragEvent<El>)
        const on = useCall(_on)
        useEffect(() => {
                self({ on })
                return () => void self({ on })
        })

        return self
}
