import { useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

const isFun = <T>(target: T) => typeof target === 'function'

export interface Atom<T> {
        value: T
        mount(update: Dispatch<SetStateAction<T>>): void
        clean(update: Dispatch<SetStateAction<T>>): void
}

export const atom = <T>(value: T) => {
        const set = new Set<Dispatch<SetStateAction<T>>>()
        return {
                get value() {
                        return value
                },
                set value(next) {
                        value = isFun(next) ? (next as Function)(value) : value
                        set.forEach((update) => update(value))
                },
                mount(update) {
                        set.add(update)
                },
                clean(update) {
                        set.delete(update)
                },
        } as Atom<T>
}

export const useAtomValue = <T>(anAtom: Atom<T>) => {
        const [value, update] = useState(anAtom.value)

        useEffect(() => {
                anAtom.mount(update)
                return () => {
                        anAtom.clean(update)
                }
        }, [anAtom])

        return value
}

export const useSetAtom = <T>(anAtom: Atom<T>) => {
        return useRef((value: T | ((p: T) => T)) => {
                anAtom.value = value as T
        }).current
}

export const useAtom = <T>(anAtom: Atom<T>) => [
        useAtomValue(anAtom),
        useSetAtom(anAtom),
]
