import * as React from 'react'
import { Fragment, useMemo } from 'react'
import { Flex, Box, useRefs } from '../atoms'
import { useWindowSize } from './hooks'
import { Separator } from './Separator'
import { Splitter } from './Splitter'

export interface SeparateProps {
        rate?: number[]
        row?: boolean
        gap?: number
        top?: boolean
        children?: React.ReactNode
}

export const Separate = (props: SeparateProps) => {
        const { rate = [], gap: g = 3, top, row, children } = props
        if (!Array.isArray(children))
                throw new Error(`children must be an array`)
        if (children.length !== rate.length)
                throw new Error(`children length must be equal to rate length`)

        let [w, h] = useWindowSize()
        w -= g * 2 // padding
        h -= g * 2 // padding
        h -= 60 // header

        const size = (row ? w : h) - g * (rate.length - 1) // px
        const refs = useRefs<HTMLDivElement | null>()

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
                                                {/* <Splitter
                                                        i={i}
                                                        w={w}
                                                        h={h}
                                                        gap={g}
                                                        row={row}
                                                        size={size}
                                                        rate={rate}
                                                        refs={refs}
                                                /> */}
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
                [size, rate, g, top, row, children]
        )
}
