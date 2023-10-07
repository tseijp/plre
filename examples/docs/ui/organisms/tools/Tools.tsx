import * as React from 'react'
import { PL } from 'plre/types'
import { Flex } from '../../atoms'
import { TransformTool } from './TransformTool'

export interface ToolsProps {
        self: PL
}
export const Tools = (props: ToolsProps) => {
        const { self } = props
        // const [isOpen, set] = useState(false)

        return (
                <>
                        <Flex
                                gap="1rem"
                                top="initial"
                                bottom={0}
                                left="initial"
                                right={0}
                                width="100%"
                                maxWidth="13rem"
                                height="auto"
                                position="absolute"
                                alignItems="start"
                                borderRadius="4px"
                                justifyContent="start"
                                overflowY="scroll"
                                backdropFilter="blur(1px)"
                                backgroundColor="rgba(61, 61, 61, 0.75)"
                        >
                                <TransformTool self={self} />
                        </Flex>
                </>
        )
}
