import event from 'reev'
import { useState } from 'react'
import { useCall } from './useCall'

const DELAY = 100

type ResizeEventCallback = (entry: ResizeObserverEntry) => () => void

export const resizeEvent = (on: ResizeEventCallback) => {
        const self = event<{
                ref(target: Element): void
                listener(): void
                observer: ResizeObserver | null
        }>({
                observer: null,
                listener: () => {},
                ref(target: Element) {
                        if (!target) return
                        const register = (entry: ResizeObserverEntry) => {
                                if (entry.target !== target) return
                                const id = setTimeout(on(entry), DELAY)
                                self.listener()
                                self.listener = () => clearTimeout(id)
                        }

                        self.observer = new ResizeObserver((entries) => {
                                entries.forEach(register)
                        })

                        self.observer.observe(target)
                },
        })
        return self
}

export const useResizeEvent = (_on: ResizeEventCallback) => {
        const on = useCall(_on)
        const [self] = useState(() => resizeEvent(on))
        return self
}
