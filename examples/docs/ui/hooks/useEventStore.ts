import { useRef, useSyncExternalStore } from 'react'
import type { EventState } from 'reev/types'

export const useEventStore = <T extends object, E extends EventState<T>>(
        event: E,
        key: string | number,
        _get: string = 'get ' + key,
        _set: string = 'set ' + key
) => {
        const { subscribe, getSnapshot } = useRef({
                subscribe(callback: () => void) {
                        if (!event[_get]) {
                                event({
                                        [_get]: event[key],
                                        [_set]: (value: T[keyof T]) => {
                                                event[_get] = value
                                        },
                                } as T)
                                Object.defineProperty(event, key, {
                                        get: () => event[_get],
                                        set: event[_set],
                                })
                        }
                        event(_set as keyof T, callback as T[keyof T])
                        return () => {
                                event(_set as keyof T, callback as T[keyof T])
                        }
                },
                getSnapshot: () => event[key],
        }).current

        return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
