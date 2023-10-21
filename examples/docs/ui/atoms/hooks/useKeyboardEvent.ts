import { useEffect } from 'react'
import { event } from 'reev'
import { useCall, useOnce } from '.'

export interface KeyboardState<El extends Element = Element> {
        target: El | Window
        key: string
        code: string
        event: KeyboardEvent
        on(e: KeyboardEvent): void
        mount(el: El): void
        clean(): void
        ref(el: Element | null): void
}

export const keyboardEvent = <El extends Element = Element>(
        _on = (_self: KeyboardState) => {}
) => {
        const on = (e: KeyboardEvent) => {
                self.event = e
                self.key = e.key
                self.code = e.code
                _on(self)
        }

        const mount = (el: El | Window) => {
                if (!el) el = el || window
                self.target = el
                el.addEventListener('keydown', self.on)
        }

        const clean = () => {
                const el = self.target
                if (!el) return
                el.removeEventListener('keydown', self.on)
        }

        const ref = (el: Element | null) => {
                if (el) self.mount(el as El)
                else self.clean()
        }

        const self = event<KeyboardState<El>>({ on, mount, clean, ref })
        return self
}

export const useKeyboardEvent = (_on = (_self: KeyboardState) => {}) => {
        const on = useCall(_on)
        const self = useOnce(() => keyboardEvent(on))
        return self
}
