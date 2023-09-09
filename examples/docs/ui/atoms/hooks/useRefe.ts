import { useRef } from 'react'
import type { MutableRefObject } from 'react'

export interface RefEffect<T> {
        (el: T | null): void
        current?: T
        effect?: () => (() => void) | void
        clean?: (() => void) | void
}

export const useRefe = <T>(effect: RefEffect<T>['effect']) => {
        const ref = useRef<RefEffect<T | undefined>>((el) => {
                if (el) {
                        ref.current = el
                        ref.clean = ref.effect()
                } else if (ref.clean) {
                        ref.clean()
                        ref.clean = undefined
                }
        }).current

        ref.effect = effect

        return ref as MutableRefObject<T | undefined>
}
