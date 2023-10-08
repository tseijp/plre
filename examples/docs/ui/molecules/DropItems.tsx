import * as React from 'react'
import { Flex } from '../atoms'

export interface DropItemsProps<T = any> {
        items: T[]
        children: (item: T, index: number) => JSX.Element
}

export const DropItems = (props: DropItemsProps) => {
        const { items, children } = props
        return (
                <Flex
                        gap="0.5rem"
                        color="white"
                        padding="0.5rem"
                        alignItems="start"
                        borderRadius="5px"
                        whiteSpace="nowrap"
                >
                        {items.map(children)}
                </Flex>
        )
}
