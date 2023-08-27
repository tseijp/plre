import * as React from 'react'
import { ReactNode } from 'react'

export interface TreeProps<T extends { children: T[] }> {
        children: (
                props: T,
                grandchild?: ReactNode,
                index?: number
        ) => ReactNode
        index?: number
        tree: T
}

export const Tree = <T extends { children: T[] }>(props: TreeProps<T>) => {
        const { children, index = 0, tree } = props

        return null

        if (!tree.children.length) return children(tree, null, index)

        return children(
                tree,
                tree.children.map((child, index) => {
                        return (
                                <Tree
                                        key={index}
                                        tree={child}
                                        index={index + 1}
                                        children={children}
                                />
                        )
                }),
                index
        )
}
