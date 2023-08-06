import * as React from 'react'
import { Flex } from '../atoms/Flex'

export const ViewLayer = () => {
        return (
                <Flex
                        opacity={0.5}
                        background-color="#282828"
                        // backgroundImage="linear-gradient(0deg, #ffff00 50%, #0000ff 50%)"
                        backgroundImage="linear-gradient(0deg, #282828 50%, #2B2B2B 50%)"
                        backgroundSize="42px 42px"
                >
                        Layer
                </Flex>
        )
}
