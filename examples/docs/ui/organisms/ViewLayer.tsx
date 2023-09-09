import * as React from 'react'
import { useState } from 'react'
import { Flex, Tree, useCall } from '../atoms'
import { Header, LayerItem } from '../molecules'
import { PLObject } from 'plre/types'
import type { ReactNode } from 'react'
import type { EditorState } from 'plre/types'

export interface ViewLayerProps {
        objectTree: PLObject
        // header props
        editorTree: EditorState
        editorItem: EditorState
}

export const ViewLayer = (props: ViewLayerProps) => {
        const { objectTree, ...headerProps } = props
        const [selectedObj, set] = useState<PLObject | null>(objectTree)

        const handleClick = useCall((obj: PLObject) => () => {
                obj.active = true
                set((p) => {
                        if (p && p !== obj) p.active = false
                        return obj
                })
        })

        const render = (obj: PLObject, grand: ReactNode, index = 0) => (
                <LayerItem
                        grand={grand}
                        index={index}
                        icon={obj.type?.[0]}
                        active={selectedObj === obj}
                        onClick={handleClick(obj)}
                >
                        {obj.id}
                </LayerItem>
        )

        return (
                <Flex backgroundColor="#282828">
                        <Header {...headerProps} />
                        <Flex
                                // backgroundImage="linear-gradient(0deg, #ffff00 50%, #0000ff 50%)"
                                backgroundImage="linear-gradient(0deg, #282828 50%, #2B2B2B 50%)"
                                backgroundSize="40px 40px"
                                alignItems="start"
                                justifyContent="start"
                                marginTop="6px"
                        >
                                <Tree tree={objectTree}>{render}</Tree>
                        </Flex>
                </Flex>
        )
}
