import { useRef } from 'react'

export interface Refs {
        (i: number | string): (target: Element | null) => void
        [i: number | string]: { current: Element | null }
}

export const useRefs = () => {
        const refs = useRef((i: number) => {
                if (!refs[i]) {
                        refs[i] = (target: Element | null) => {
                                refs[i].current = target
                        }
                        refs[i].current = null
                        refs.len++
                }
                return refs[i]
        }).current as unknown as { len: number }

        refs.len = refs.len || 0

        return refs as Refs & { len: number }
}

export const useRefs_ = () => {
        const refs = useRef((i: number) => {
                if (!refs[i]) {
                        refs[i] = (target: Element | null) => {
                                refs[i].current = target
                        }
                        refs[i].current = null
                        refs.length++
                }
                return refs[i]
        }).current as { length: number }

        refs.length = refs.length || 0

        return refs as Refs
}
