import { createEditor } from 'plre'
import { EditorState } from 'plre/types'
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

export const xyDir = (x: number, y: number) => {
        return x ** 2 > y ** 2 ? (sign(x) > 0 ? 1 : 3) : sign(y) > 0 ? 2 : 0
}

export const splitEditor = (
        item: EditorState,
        i: number,
        j: number,
        row: boolean
) => {
        const child = item.children[i]

        // recursive split
        if (Array.isArray(child.children) && child.children.length > 0) {
                const l = child.children.length - 1
                const k = child.row ? [0, l, l, 0][j] : [0, 0, l, l][j]
                return splitEditor(child, k, j, row)
        }

        const rate = [0.5, 0.5]
        const id = child.id + '2'
        const newGrand = createEditor(child.type, { id, ...child })
        const newChild = createEditor('I', { row, rate }, [child, newGrand])
        item.children[i] = newChild
}

const getParent = (tree: EditorState, item: EditorState) => {
        if (tree.children.includes(item)) return tree
        for (const child of tree.children) {
                if (Array.isArray(child.children)) {
                        if (child.children.includes(item)) return child
                        const parent = getParent(child, item)
                        if (parent) return parent
                }
        }
}

export const shrinkEditor = (
        tree: EditorState,
        item: EditorState,
        i: number
) => {
        if (tree === item) {
                tree.children = [tree.children[i]]
                tree.rate = [1]
                return
        }

        const parent = getParent(tree, item)
        const id = parent.children.indexOf(item)
        parent.children[id] = item.children[i]
}
