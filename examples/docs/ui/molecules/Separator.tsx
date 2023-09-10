import * as React from 'react'
import { gsap } from 'gsap'
import { Box, useWindowSize } from '../atoms'
import { useSeparatorEvent } from './hooks'
import type { Refs } from '../atoms'
import { useSeparatorSize } from './hooks/useSeparatorSize'
import { EDITOR_GAP_SIZE } from '../utils'

export interface SeparatorProps {
        i: number
        rate: number[]
        row?: boolean
        refs: Refs<HTMLDivElement | null>
}

export const Separator = (props: SeparatorProps) => {
        const { i, row, rate, refs } = props
        if (!i) return null

        const [w, h] = useWindowSize()
        const size = useSeparatorSize(rate.length, row)
        const drag = useSeparatorEvent(w, h, (duration) => {
                const delta = drag.offset[row ? 0 : 1]
                const [da, db] = [rate[i - 1], rate[i]]
                const [_a, _b] = [refs[i - 1]?.current, refs[i]?.current]
                gsap.to(_a, { flexBasis: size * da + delta, duration })
                gsap.to(_b, { flexBasis: size * db - delta, duration })
        })

        return (
                <Box
                        ref={drag.ref}
                        cursor={`${!row ? 'row' : 'col'}-resize`}
                        basis={`${EDITOR_GAP_SIZE}px`}
                        grow={0}
                        // ref: https://stackoverflow.com/questions/15381172/how-can-i-make-flexbox-children-100-height-of-their-parent
                        height="auto"
                        shrink={0}
                        display="flex"
                        alignSelf="stretch"
                />
        )
}
