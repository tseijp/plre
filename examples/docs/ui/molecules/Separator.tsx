import * as React from 'react'
import { gsap } from 'gsap'
import { useRef, useEffect } from 'react'
import { Box, useCallback } from '../atoms'
import { useDragEvent } from './hooks'
import type { Refs } from '../atoms'

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
        const wh = useRef([w, h]).current

        const move = useCallback((duration = 0) => {
                const delta = drag.offset[row ? 0 : 1]
                const [da, db] = [rate[i - 1], rate[i]]
                const [_a, _b] = [refs[i - 1]?.current, refs[i]?.current]
                gsap.to(_a, { flexBasis: size * da + delta, duration })
                gsap.to(_b, { flexBasis: size * db - delta, duration })
        })

        const drag = useDragEvent((drag) => {
                if (!drag.active) return
                move(0.5)
        })

        const resize = useCallback(() => {
                const [_w, _h] = wh
                const [_x, _y] = drag.offset
                drag.offset = [(_x * w) / _w, (_y * h) / _h]
                move()
                wh[0] = w
                wh[1] = h
        })

        useEffect(() => {
                window.addEventListener('resize', resize)
                return () => {
                        window.removeEventListener('resize', resize)
                }
        }, [])

        return (
                <Box
                        ref={drag.ref}
                        cursor={`${!row ? 'row' : 'col'}-resize`}
                        basis={`${gap}px`}
                        grow={0}
                        // ref: https://stackoverflow.com/questions/15381172/how-can-i-make-flexbox-children-100-height-of-their-parent
                        height="auto"
                        display="flex"
                        alignSelf="stretch"
                />
        )
}
