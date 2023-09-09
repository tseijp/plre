import * as React from 'react'
import { Fragment, useMemo } from 'react'
import { Flex, Box, useRefs, useCall } from '../atoms'
import { useWindowSize } from '../atoms'
import { Separator } from './Separator'
import { Splitter } from './Splitter'
import { shrinkEditor, splitEditor, HEADER_PADDING_SIZE } from '../utils'
import type { EditorState } from 'plre/types'

export interface SeparateProps {
        gap?: number
        children?: React.ReactNode
        editorItem: EditorState
        editorTree: EditorState
}

export const Separate = (props: SeparateProps) => {
        const { gap: g = 3, children, editorItem, editorTree } = props
        const { rate = [], top, row } = editorItem
        if (!Array.isArray(children))
                throw new Error(`children must be an array`)
        if (children.length !== rate.length)
                throw new Error(`children length must be equal to rate length`)

        let [w, h] = useWindowSize()
        w -= g * 2 // padding
        h -= g * 2 // padding
        h -= HEADER_PADDING_SIZE // header

        const size = (row ? w : h) - g * (rate.length - 1) // px
        const refs = useRefs<HTMLDivElement | null>()

        const handleSplit = useCall((i = 0, j = 0, row = false) => {
                splitEditor(editorItem, i, j, row)
                editorTree.update()
        })

        const handleShrinkStart = useCall((i) => {
                // console.log({ ...editorItem })
        })

        const handleShrinkEnd = useCall((i) => {
                shrinkEditor(editorTree, editorItem, i)
                editorTree.update()
                // console.log({ ...editorItem })
        })

        return useMemo(
                () => (
                        <Flex row={row} background="#161616" borderRadius={5}>
                                {rate.map((r, i) => (
                                        <Fragment key={i}>
                                                {!i || (
                                                        <Separator
                                                                i={i}
                                                                w={w}
                                                                h={h}
                                                                gap={g}
                                                                row={row}
                                                                size={size}
                                                                rate={rate}
                                                                refs={refs}
                                                        />
                                                )}
                                                <Box
                                                        key={i}
                                                        ref={refs(i)}
                                                        basis={size * r}
                                                        borderRadius={5}
                                                >
                                                        <Splitter
                                                                i={i}
                                                                top={top}
                                                                row={row}
                                                                onSplit={
                                                                        handleSplit
                                                                }
                                                                onShrinkEnd={
                                                                        handleShrinkEnd
                                                                }
                                                                onShrinkStart={
                                                                        handleShrinkStart
                                                                }
                                                        />
                                                        {children[i]}
                                                </Box>
                                        </Fragment>
                                ))}
                        </Flex>
                ),
                [size, rate, g, top, row, children]
        )
}
