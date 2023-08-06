import { pl } from 'plre'
import { useRef } from 'react'
import type { PL } from 'plre/types'

export const useResizeEvent = (self: PL = pl) => {
        const cache = useRef<{
                observer: ResizeObserver | null
                ref: (target: Element) => void
        }>({
                observer: null,
                ref(target) {
                        if (!target) return

                        cache.observer = new ResizeObserver((entries) => {
                                entries.forEach((entry) => {
                                        if (entry.target !== target) return
                                        self.width = entry.contentRect.width
                                        self.height = entry.contentRect.height
                                        self.resize()
                                })
                        })

                        cache.observer.observe(target)
                },
        }).current

        return cache.ref
}
