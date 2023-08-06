import * as React from 'react'
import { Fragment } from 'react'
import { gsap } from 'gsap'
import { Flex } from '../atoms/Flex'
import { Box } from '../atoms/Box'
import { useRefs } from '../hooks/useRefs'
import { useDragEvent } from '../hooks/useDragEvent'
import { useWindowSize } from '../hooks/useWindowSize'
import type { Refs } from '../hooks/useRefs'

export interface SeparateProps {
        rate?: number[]
        row?: boolean
        top?: boolean
        gap?: number
        children?: React.ReactNode
}

export const Separate = (props: SeparateProps) => {
        const { rate = [], gap: g = 3, top, row, children } = props
        if (!Array.isArray(children)) throw new Error('not supported')
        let [w, h] = useWindowSize()
        h -= 60 // header
        w -= g * 2 // padding
        h -= g * 2 // padding
        const size = (row ? w : h) - g * (rate.length - 1)
        const refs = useRefs()

        return (
                <Flex
                        row={row}
                        padding={top ? `${g}px ${g}px` : void 0}
                        backgroundColor={top ? '#161616' : void 0}
                        background="#161616"
                >
                        {rate.map((r, i) => (
                                <Fragment key={i}>
                                        {!i || (
                                                <Separator
                                                        i={i}
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
                                                cursor="auto"
                                        >
                                                {children[i]}
                                        </Box>
                                </Fragment>
                        ))}
                </Flex>
        )
}

export interface SeparatorProps extends SeparateProps {
        i: number
        size: number
        refs: Refs
}

const Separator = (props: SeparatorProps) => {
        const { i, gap, row, size, rate, refs } = props
        const drag = useDragEvent((drag) => {
                if (!drag.active) return
                const move = drag.offset[row ? 0 : 1]
                const [da, db] = [rate[i - 1], rate[i]]
                const [_a, _b] = [refs.current[i - 1], refs.current[i]]
                gsap.to(_a, { flexBasis: size * da + move })
                gsap.to(_b, { flexBasis: size * db - move })
        })

        return (
                <Box
                        ref={drag.ref}
                        cursor={`${!row ? 'row' : 'col'}-resize`}
                        basis={`${gap}px`}
                        // ref: https://stackoverflow.com/questions/15381172/how-can-i-make-flexbox-children-100-height-of-their-parent
                        height="auto"
                        display="flex"
                        alignSelf="stretch"
                />
        )
}
