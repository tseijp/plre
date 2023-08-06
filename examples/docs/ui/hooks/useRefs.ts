import { useRef } from 'react'

export interface Refs {
        (i: number | string): (target: Element | null) => void
        current: { [key: number]: Element | null }
}

export const useRefs = () => {
        const refs = useRef((i: number) => {
                if (!refs.current[i]) refs.current[i] = null
                if (!refs[i])
                        refs[i] = (target: Element | null) => {
                                refs.current[i] = target
                        }
                return refs[i]
        }).current as Refs

        if (!refs.current) refs.current = {}

        return refs
}
