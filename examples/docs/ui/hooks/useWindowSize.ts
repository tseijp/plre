import { event } from 'reev'
import { useSyncExternalStore } from 'react'

export const self = event<{
        mount(): void
        clean(): void
        callback(): void
        snapshot: [w: number, height: number]
}>({
        mount() {
                self.callback()
                // window.addEventListener('resize', self.callback)
        },
        clean() {
                window.removeEventListener('resize', self.callback)
        },
        callback() {
                self.snapshot = [window.innerWidth, window.innerHeight]
        },
        snapshot: [1280, 800],
})

const subscribe = (callback) => {
        self({ callback }).mount()
        return () => self.clean()
}

const getSnapshot = () => self.snapshot

export const useWindowSize = () => {
        return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
