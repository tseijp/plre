import { useRef } from 'react'

export const useCallback = <T extends (...args: any[]) => any>(callback: T) => {
        const self = useRef({
                callback,
                cache: (...args: any[]) => self.callback(...args),
        }).current

        self.callback = callback

        return self.cache
}
