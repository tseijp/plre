import * as React from 'react'
import { gsap } from 'gsap'
import { Box } from '../atoms'
import type { Refs } from '../atoms'
import { useSeparatorEvent } from './hooks/useSeparatorEvent'

export interface SeparatorProps {
        i: number
        w: number
        h: number
        size: number
        rate?: number[]
        row?: boolean
        gap?: number
        refs: Refs<HTMLDivElement | null>
}

export const Separator = (props: SeparatorProps) => {
        const { i, w, h, size, gap, row, rate, refs } = props
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
                        basis={`${gap}px`}
                        grow={0}
                        // ref: https://stackoverflow.com/questions/15381172/how-can-i-make-flexbox-children-100-height-of-their-parent
                        height="auto"
                        shrink={0}
                        display="flex"
                        alignSelf="stretch"
                />
        )
}
