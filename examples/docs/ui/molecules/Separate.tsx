import * as React from 'react'
import { Fragment } from 'react'
import { gsap } from 'gsap'
import { Flex } from '../atoms/Flex'
import { Box } from '../atoms/Box'
import { useRefs } from '../hooks/useRefs'
import { useDragEvent } from '../hooks/useDragEvent'
import { useWindowSize } from '../hooks/useWindowSize'

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
                        gap={g}
                        padding={top ? `${g}px ${g}px` : void 0}
                        backgroundColor={top ? '#161616' : void 0}
                        background="#161616"
                >
                        {rate.map((r, i) => (
                                <>
                                        {/* {i && (
                                                <Separator
                                                        on={console.log}
                                                        row={row}
                                                        gap={g}
                                                />
                                        )} */}
                                        <Box
                                                key={i}
                                                ref={refs(i)}
                                                basis={size * r}
                                                cursor="auto"
                                        >
                                                {children[i]}
                                        </Box>
                                </>
                        ))}
                </Flex>
        )
}

export interface SeparatorProps extends SeparateProps {
        on: () => void
}

// const Separator = (props: SeparatorProps) => {
//         const { gap, row, on } = props
//         const ref = useDragEvent(on)

//         return (
//                 <Box
//                         ref={ref}
//                         display="flex"
//                         cursor={`${!row ? 'row' : 'col'}-resize`}
//                         basis={`${gap}px`}
//                         alignItems="stretch"
//                         backgroundColor="red"
//                 >
//                         HI
//                 </Box>
//         )
// }
