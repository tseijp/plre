import type { PLObject } from 'plre/types'
import { getParent, isOffspring } from '../utils'

export const moveObject = (
        tree: PLObject,
        grabbed: PLObject,
        hovered: PLObject
) => {
        if (isOffspring(grabbed, hovered)) return alert('ERROR')
        const parent = getParent(tree, grabbed)
        hovered.children.push(grabbed)
        parent.children.splice(parent.children.indexOf(grabbed), 1)
        sortObject(tree)
        return tree
}

export const sortObject = (tree: PLObject) => {
        const { children } = tree
        if (!children) return
        children.sort((a, b) => (a.id < b.id ? -1 : 1))
        children.forEach(sortObject)
        return tree
}
