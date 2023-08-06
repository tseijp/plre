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
                window.addEventListener('resize', self.callback)
        },
        clean() {
                window.removeEventListener('resize', self.callback)
        },
        callback() {
                self.snapshot = [window.innerWidth, window.innerHeight]
        },
})

const subscribe = (callback) => {
        self({ callback }).mount()
        return () => self.clean()
}

const getSnapshot = () => self.snapshot || [0, 0]

const getServerSnapshot = () => [0, 0]

export const useWindowSize = () => {
        return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}