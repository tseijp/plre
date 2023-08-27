import * as React from 'react'
import { Flex } from '../atoms/Flex'
import { Tree } from '../atoms/Tree'
import { LayerItem } from '../molecules/LayerItem'
import { PL, PLObject } from 'plre/types'

export interface ViewLayerProps {
        self: PL
        obj: PLObject
}

export const ViewLayer = (props: ViewLayerProps) => {
        const { obj } = props
        return (
                <Flex backgroundColor="#282828">
                        <Flex height="25px"></Flex>
                        <Flex
                                // backgroundImage="linear-gradient(0deg, #ffff00 50%, #0000ff 50%)"
                                backgroundImage="linear-gradient(0deg, #282828 50%, #2B2B2B 50%)"
                                backgroundSize="42px 42px"
                                alignItems="start"
                                justifyContent="start"
                        >
                                <Tree tree={obj}>
                                        {({ type }, children, index) => (
                                                <>
                                                        <LayerItem
                                                                index={index}
                                                        >
                                                                {type}
                                                                {children}
                                                        </LayerItem>
                                                </>
                                        )}
                                </Tree>
                        </Flex>
                </Flex>
        )
}
