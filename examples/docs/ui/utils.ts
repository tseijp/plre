export const rand = (n = 1) => (Math.random() * n) << 0

export const randColor = () =>
        '#' + ((Math.random() * (1 << 24)) << 0).toString(16)

export const range = (n = 1) => [...Array(n)].map((_, i) => i)

export const clamp = (n = 0, min = 0, max = 1) =>
        Math.max(min, Math.min(max, n))
