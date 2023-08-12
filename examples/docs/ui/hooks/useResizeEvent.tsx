import { pl } from 'plre'
import { useRef } from 'react'
import type { PL } from 'plre/types'

const DELAY = 100

export const useResizeEvent = (self: PL = pl) => {
        const cache = useRef({
                observer: null,
                listener: () => {},
                ref(target: Element) {
                        if (!target) return
                        const callback = (entry: ResizeObserverEntry) => () => {
                                self.width = entry.contentRect.width
                                self.height = entry.contentRect.height
                                self.resize()
                        }
                        const register = (entry: ResizeObserverEntry) => {
                                if (entry.target !== target) return
                                const id = setTimeout(callback(entry), DELAY)
                                cache.listener()
                                cache.listener = () => clearTimeout(id)
                        }

                        cache.observer = new ResizeObserver((entries) => {
                                entries.forEach(register)
                        })

                        cache.observer.observe(target)
                },
        }).current

        return cache.ref
}
