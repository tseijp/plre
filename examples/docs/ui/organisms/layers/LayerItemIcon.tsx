import * as React from 'react'
import type { ReactNode } from 'react'
import { Flex } from '../../atoms/Flex'

export interface LayerItemIconProps {
        active?: boolean
        children?: ReactNode
}

export const LayerItemIcon = (props: LayerItemIconProps) => {
        const { active, children } = props
        return (
                <Flex
                        width="20px"
                        height="20px"
                        marginLeft="2px"
                        userSelect="none"
                        lineHeight="15px"
                        borderRadius="4px"
                        border={active ? '1px solid #696969' : ''}
                        background={active ? '#535353' : ''}
                        display="flex"
                >
                        {children}
                </Flex>
        )
}
