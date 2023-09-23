import { createEditor } from 'plre'
import { getParent } from '../utils'
import type { DragState } from '../atoms'
import type { EditorState } from 'plre/types'

export const splitEditor = (
        item: EditorState,
        drag: DragState,
        i: number,
        j: number,
        dir: number
) => {
        const child = item.children[i]
        const row = dir === 1 || dir === 3
        // recursive split
        if (Array.isArray(child.children) && child.children.length > 0) {
                const l = child.children.length - 1
                const k = child.row ? [0, l, l, 0][j] : [0, 0, l, l][j]
                return splitEditor(child, drag, k, j, dir)
        }

        // prettier-ignore
        const rate = [[1, 0], [0, 1], [0, 1], [1, 0]][dir]
        const id = child.id + '2'
        const newGrand = createEditor(child.type, { id, ...child })
        const newChild = createEditor('I', { row, rate }, [child, newGrand])
        newChild.memo.parentSplitter = drag
        item.children[i] = newChild
}

export const shrinkEditor = (
        tree: EditorState,
        item: EditorState,
        expandId: number
) => {
        if (tree === item) {
                tree.children = [tree.children[expandId]]
                tree.rate = [1]
                return
        }

        const parent = getParent(tree, item)
        const id = parent.children.indexOf(item)
        parent.children[id] = item.children[expandId]
}
