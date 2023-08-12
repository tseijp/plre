import * as React from 'react'
import { Fragment, useRef, useMemo, useEffect } from 'react'
import { gsap } from 'gsap'
import { Flex } from '../atoms/Flex'
import { Box } from '../atoms/Box'
import { useRefs } from '../hooks/useRefs'
import { useDragEvent } from '../hooks/useDragEvent'
import { useWindowSize } from '../hooks/useWindowSize'
import type { Refs } from '../hooks/useRefs'
import { useCallback } from '../hooks/useCallback'

export interface SeparateProps {
        rate?: number[]
        row?: boolean
        top?: boolean
        gap?: number
        children?: React.ReactNode
}

export const Separate = (props: SeparateProps) => {
        const { rate = [], gap: g = 3, top, row, children } = props
        const deps = [rate, g, top, row, children]
        if (!Array.isArray(children)) throw new Error('not supported')
        let [w, h] = useWindowSize()
        w -= g * 2 // padding
        h -= g * 2 // padding
        h -= 60 // header
        const size = (row ? w : h) - g * (rate.length - 1)
        const refs = useRefs()

        return useMemo(
                () => (
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
                                                        cursor="auto"
                                                >
                                                        {children[i]}
                                                </Box>
                                        </Fragment>
                                ))}
                        </Flex>
                ),
                [size, ...deps]
        )
}

export interface SeparatorProps extends SeparateProps {
        i: number
        w: number
        h: number
        size: number
        refs: Refs
}

const Separator = (props: SeparatorProps) => {
        const { i, w, h, gap, row, size, rate, refs } = props
        const wh = useRef([w, h]).current
        const move = (duration = 0) => {
                const delta = drag.offset[row ? 0 : 1]
                const [da, db] = [rate[i - 1], rate[i]]
                const [_a, _b] = [refs.current[i - 1], refs.current[i]]
                gsap.to(_a, { flexBasis: size * da + delta, duration })
                gsap.to(_b, { flexBasis: size * db - delta, duration })
        }

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
