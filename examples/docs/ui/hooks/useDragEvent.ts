import { useState } from 'react'
import { event } from 'reev'
import type { EventState } from 'reev'

type Vec2 = [number, number]
const addV = (a: Vec2, b: Vec2) => [a[0] + b[0], a[1] + b[1]] as Vec2
const subV = (a: Vec2, b: Vec2) => [a[0] - b[0], a[1] - b[1]] as Vec2

export interface DragEvent {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: Element
        on(self: DragEvent): void
        move(e: PointerEvent): void
        down(e: PointerEvent): void
        up(e: PointerEvent): void
        mount(target: Element): void
        clean(): void
        ref(traget: Element): void
}

export const useDragEvent = (on: () => void) => {
        const [self] = useState(() => {
                return event({
                        move(e: any) {
                                self._active = self.active
                                self._value = self.value
                                self.value = [e.clientX, e.clientY]
                                if (self._active) {
                                        self.delta = subV(
                                                self.value,
                                                self._value
                                        )
                                        self.offset = addV(
                                                self.offset,
                                                self.delta
                                        )
                                        self.movement = addV(
                                                self.movement,
                                                self.delta
                                        )
                                }
                                self.on(self)
                        },
                        down(e: any) {
                                self._active = !(self.active = true)
                                self.target.setPointerCapture(e.pointerId)
                                self.on(self)
                        },
                        up(e: any) {
                                self._active = !(self.active = false)
                                self.delta = self.movement = [0, 0]
                                self.target.releasePointerCapture(e.pointerId)
                                self.on(self)
                        },
                        mount(target: Element) {
                                self.active = self._active = false
                                self._value = [0, 0]
                                self._value = [0, 0]
                                self.delta = [0, 0]
                                self.offset = [0, 0]
                                self.movement = [0, 0]
                                self.target = target
                                target.addEventListener(
                                        'pointermove',
                                        self.move
                                )
                                target.addEventListener(
                                        'pointerdown',
                                        self.down
                                )
                                target.addEventListener('pointerleave', self.up)
                                target.addEventListener('pointerup', self.up)
                        },
                        clean() {
                                const target = self.target
                                target.removeEventListener(
                                        'pointermove',
                                        self.move
                                )
                                target.removeEventListener(
                                        'pointerdown',
                                        self.down
                                )
                                target.removeEventListener(
                                        'pointerleave',
                                        self.up
                                )
                                target.removeEventListener('pointerup', self.up)
                        },
                        ref(target: Element | null) {
                                if (target) self.mount(target)
                                else self.clean()
                        },
                }) as EventState<DragEvent>
        })

        self.on = on
        return self
}
