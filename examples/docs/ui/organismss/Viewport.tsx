import * as React from 'react'
import { Flex } from '../atoms/Flex'
import { randColor } from '../utils'

export const Viewport = () => {
        return (
                <Flex opacity={0.5} background={randColor()}>
                        Viewport
                </Flex>
        )
}
