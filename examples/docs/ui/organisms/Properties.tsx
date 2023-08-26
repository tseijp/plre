import * as React from 'react'
import { Flex } from '../atoms/Flex'
import { useCodemirror } from '../hooks/useCodemirror'

export const Properties = () => {
        const self = useCodemirror()
        return (
                <Flex background="#303030">
                        <Flex height="25px"></Flex>
                        <Flex ref={self.ref} />
                </Flex>
        )
}
