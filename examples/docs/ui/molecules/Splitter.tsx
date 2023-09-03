import * as React from 'react'
import { Box } from '../atoms'
import type { Refs } from '../atoms'

export interface SplitterProps {
        i: number
        w: number
        h: number
        size: number
        rate?: number[]
        row?: boolean
        gap?: number
        refs: Refs<HTMLDivElement | null>
}

export const Splitter = (_props: SplitterProps) => {
        return (
                <>
                        <Box
                                top={0}
                                left={0}
                                width="10px"
                                height="10px"
                                background="red"
                                position="absolute"
                        ></Box>
                        <Box
                                top={0}
                                right={0}
                                width="10px"
                                height="10px"
                                background="green"
                                position="absolute"
                        ></Box>
                        <Box
                                bottom={0}
                                left={0}
                                width="10px"
                                height="10px"
                                background="blue"
                                position="absolute"
                        ></Box>
                        <Box
                                bottom={0}
                                right={0}
                                width="10px"
                                height="10px"
                                background="pink"
                                position="absolute"
                        ></Box>
                </>
        )
}
