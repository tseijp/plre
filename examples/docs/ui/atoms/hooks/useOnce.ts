import { useRef } from 'react'

export const useOnce = <T>(callback: () => T): T => {
        const ref = useRef<T | null>(null)
        if (!ref.current) ref.current = callback()
        return ref.current
}
