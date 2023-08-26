import type { EventState } from 'reev/types'

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

export const rand = (n = 1) => (Math.random() * n) << 0

export const randColor = () =>
        '#' + ((Math.random() * (1 << 24)) << 0).toString(16)

export const range = (n = 1) => [...Array(n)].map((_, i) => i)

export const clamp = (n = 0, min = 0, max = 1) =>
        Math.max(min, Math.min(max, n))

const { PI, abs, sign, floor } = Math

const TAU = PI * 2

export const mod = (a = 0, b = 1) => a - floor(a / b) * b

export const rot = <T extends { tht: number; phi: number }>(a: T, b: T) => {
        let tht = mod(b.tht - a.tht, TAU)
        let phi = mod(b.phi - a.phi, TAU)

        // if (tht > PI) tht = tht - TAU
        // if (phi > PI) phi = phi - TAU
        tht = mod(tht + PI, TAU) - PI
        phi = mod(phi + PI, TAU) - PI

        tht += a.tht
        phi += a.phi

        return { tht, phi }
}
