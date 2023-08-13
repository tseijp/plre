import { pl } from 'plre'
import { useState } from 'react'
import event from 'reev'

const DELAY = 100

export const resizeEvent = () => {
        const self = event<{
                on?: () => void
                ref(target: Element): void
                listener(): void
                observer: ResizeObserver | null
        }>({
                observer: null,
                listener: () => {},
                ref(target: Element) {
                        if (!target) return
                        const callback = (entry: ResizeObserverEntry) => () => {
                                pl.width = entry.contentRect.width
                                pl.height = entry.contentRect.height
                                pl.resize()
                                self.on?.()
                        }
                        const register = (entry: ResizeObserverEntry) => {
                                if (entry.target !== target) return
                                const id = setTimeout(callback(entry), DELAY)
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

export const useResizeEvent = (on = () => {}) => {
        const [self] = useState(() => resizeEvent())
        self.on = on
        return self.ref
}
