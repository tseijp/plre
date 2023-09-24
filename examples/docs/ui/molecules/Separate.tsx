import * as React from 'react'
import { Fragment, useState } from 'react'
import { Flex, Box, useRefs, BoxProps } from '../atoms'
import { Separator } from './Separator'
import { Splitter } from './Splitter'
import { shrinkEditor, splitEditor } from './utils'
import { useSeparatorSize } from './hooks'
import { useMutable } from 'plre/react'
import type { SplitterEventHandlers } from './hooks'
import type { EditorState } from 'plre/types'
import { useCtx } from '../ctx'

export interface SeparateProps {
        gap?: number
        children?: React.ReactNode
        editorItem: EditorState
}

export const Separate = (props: SeparateProps) => {
        const { children, editorItem } = props
        const { rate = [], top, row } = editorItem
        const { editorTree } = useCtx()
        const [shrinkIndex, setShrinkIndex] = useState<null | number>(null)

        if (!Array.isArray(children))
                throw new Error(`children must be an array`)
        if (children.length !== rate.length)
                throw new Error(`children length must be equal to rate length`)

        const refs = useRefs<HTMLDivElement | null>()

        const memo = useMutable<SplitterEventHandlers>({
                onSplit(...args) {
                        splitEditor(editorItem, ...args)
                        editorTree.update()
                },
                onShrinkStart(i) {
                        setShrinkIndex(i)
                },
                onShrinkEnd(i) {
                        shrinkEditor(editorTree, editorItem, i)
                        editorTree.update()
                },
                onShrinkCancel() {
                        setShrinkIndex(null)
                },
        })

        const args = [rate.length, row] as [number, boolean]
        const render = (r: number, i: number) => (
                <Fragment key={i}>
                        <Separator
                                i={i}
                                row={row}
                                rate={rate}
                                refs={refs}
                                parentSplitter={editorItem.memo.parentSplitter}
                        />
                        <BoxWithBasis r={r} args={args} ref={refs(i)}>
                                <Splitter
                                        i={i}
                                        top={top}
                                        row={row}
                                        handlers={memo}
                                />
                                {children[i]}
                                <Overlay active={i === shrinkIndex} />
                        </BoxWithBasis>
                </Fragment>
        )

        return (
                <Flex row={row} background="#161616" borderRadius={5}>
                        {rate.map(render)}
                </Flex>
        )
}

interface BoxWithBasisProps extends BoxProps {
        r: number
        args: [len: number, row: boolean]
}

const BoxWithBasis = React.forwardRef((props: BoxWithBasisProps, ref) => {
        const { r, args, ...other } = props
        const size = useSeparatorSize(...args)
        return <Box ref={ref} basis={size * r} borderRadius={5} {...other} />
})

interface OverlayProps {
        active: boolean
}

const Overlay = (props: OverlayProps) => {
        const { active } = props
        return (
                <Flex
                        display={active ? 'flex' : 'none'}
                        transition="all 0.3s ease"
                        position="absolute"
                        backdropFilter="blur(1px)"
                        backgroundColor="rgba(0, 0, 0, 0.2)"
                        boxShadow="rgba(0, 0, 0, 0.3) 2px 8px 8px"
                />
        )
}
