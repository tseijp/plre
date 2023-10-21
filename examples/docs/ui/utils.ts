import { PL, ObjectState } from 'plre/types'
import { getLayerKey } from 'plre/utils'
import type { EventState } from 'reev/types'

export const HEADER_PADDING_SIZE = 63

export const EDITOR_GAP_SIZE = 3

export const LAYOUT_PADDING_STYLE =
        [
                HEADER_PADDING_SIZE + EDITOR_GAP_SIZE,
                EDITOR_GAP_SIZE,
                EDITOR_GAP_SIZE,
                EDITOR_GAP_SIZE,
        ].join('px ') + 'px'

export const once = <
        T extends object,
        K extends keyof T = keyof T,
        F extends T[keyof T] = T[keyof T]
>(
        self: EventState<T>,
        key: K,
        fun: F
) => {
        const callback = () => {
                self(key, fun)
                self(key, callback as F)
        }
        callback()
}

export const Up = (str: string) => str[0].toUpperCase() + str.slice(1)

export const rand = (n = 1) => (Math.random() * n) << 0

export const randColor = () =>
        '#' + ((Math.random() * (1 << 24)) << 0).toString(16)

export const range = (n = 1) => [...Array(n)].map((_, i) => i)

export const clamp = (n = 0, min = 0, max = 1) =>
        Math.max(min, Math.min(max, n))

const { PI, pow, floor } = Math

export const round = (v: number, n: number = 3, m = pow(10, n)) =>
        floor(v * m) / m

const TAU = PI * 2

export const mod = (a = 0, b = 1) => a - floor(a / b) * b

export const rot = <T extends { tht: number; phi: number }>(a: T, b: T) => {
        let tht = mod(b.tht - a.tht, TAU)
        let phi = mod(b.phi - a.phi, TAU)

        tht = mod(tht + PI, TAU) - PI
        phi = mod(phi + PI, TAU) - PI

        tht += a.tht
        phi += a.phi

        return { tht, phi }
}

export const getParent = <T extends { children: T[] }>(tree: T, item: T) => {
        if (tree.children.includes(item)) return tree
        for (const child of tree.children) {
                if (Array.isArray(child.children)) {
                        if (child.children.includes(item)) return child
                        const parent = getParent(child, item)
                        if (parent) return parent
                }
        }
}
