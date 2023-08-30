import { event } from 'reev'
import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'

export interface FieldEventState {
        on(): void
        down(): void
        change(): void
        mount(): void
        clean(): void
        target: HTMLInputElement | null
        value: string
        ref: RefObject<Element>
}

export const fieldEvent = (on = () => {}) => {
        const self = event<FieldEventState>({
                on,
                down(e: KeyboardEvent<HTMLInputElement>) {
                        if (e.code === 'Enter') self.on()
                },
                change(e: ChangeEvent<HTMLInputElement>) {
                        self.value = e.target.value
                },
                mount() {
                        self.target.addEventListener('keydown', self.down)
                        self.target.addEventListener('change', self.change)
                        self.target.addEventListener('blur', self.on)
                },
                clean() {
                        self.target.removeEventListener('keydown', self.down)
                        self.target.removeEventListener('change', self.change)
                        self.target.removeEventListener('blur', self.on)
                },
                ref(el: HTMLInputElement | null) {
                        if (el) {
                                self.target = el
                                self.mount()
                        } else self.clean()
                },
        })
        return self
}

export const useFieldEvent = (on = () => {}) => {
        const [field] = useState(() => fieldEvent(on))
        return field
}
