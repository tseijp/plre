import { useRef } from 'react'

export interface Call<T extends (...args: any[]) => any> {
        (...args: Parameters<T>): ReturnType<T>
        callback?: T
}

export const useCall = <T extends (...args: any[]) => any>(callback: T) => {
        const ref = useRef<Call<T>>((...args: any[]) =>
                ref.callback(...args)
        ).current

        ref.callback = callback

        return ref
}

// export const useCall = <T extends (...args: any[]) => any>(callback: T) => {
//         const self = useRef({
//                 callback,
//                 cache: (...args: any[]) => self.callback(...args),
//         }).current

//         self.callback = callback

//         return self.cache
// }
