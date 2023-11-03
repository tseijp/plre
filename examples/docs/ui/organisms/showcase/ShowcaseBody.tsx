import * as React from 'react'
import { Flex } from '../../../ui/atoms'

export interface ShowcaseBodyProps {
        children: React.ReactNode
}

export const ShowcaseBody = (props: ShowcaseBodyProps) => {
        const { children } = props
        return (
                <Flex
                        margin="5rem auto"
                        maxWidth="80%"
                        display="grid"
                        gap="1.5rem"
                        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                >
                        {children}
                </Flex>
        )
}
