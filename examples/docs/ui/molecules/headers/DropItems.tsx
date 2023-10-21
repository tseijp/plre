import * as React from 'react'
import { Flex } from '../../atoms'

export interface DropItemsProps<T = any> {
        items: T[]
        children: (item: T, index: number) => JSX.Element
}

export const DropItems = (props: DropItemsProps) => {
        const { items, children } = props
        return (
                <Flex color="white" alignItems="start" borderRadius="5px">
                        {items.map(children)}
                </Flex>
        )
}
