import { useRef } from 'react'

export interface Refs<T> {
        (i: number | string): (target: T | null) => void
        [i: number | string]: { current: T | null }
}

export const useRefs = <T>(init?: T) => {
        const refs = useRef((i: number | string) => {
                if (!refs[i]) {
                        refs[i] = (target: Element | null) => {
                                refs[i].current = target
                        }
                        refs[i].current = init
                        refs.len++
                }
                return refs[i]
        }).current as unknown as { len: number }

        refs.len = refs.len || 0

        return refs as Refs<T> & { len: number }
}
