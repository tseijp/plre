import * as React from 'react'
import { Flex, Tree, useOnce } from '../atoms'
import { Header, LayerItem } from '../molecules'
import { PLObject } from 'plre/types'
import { useViewLayer } from './hooks'
import type { ReactNode } from 'react'
import type { EditorState } from 'plre/types'
import { sortObject } from './utils'

export interface ViewLayerProps {
        objectTree: PLObject
        // header props
        editorTree: EditorState
        editorItem: EditorState
}
export const ViewLayer = (props: ViewLayerProps) => {
        const { objectTree, ...headerProps } = props

        useOnce(() => sortObject(objectTree))

        const { selected, hovered, handlers } = useViewLayer(objectTree)

        const render = (obj: PLObject, grand: ReactNode, index = 0) => (
                <LayerItem
                        key={obj.id}
                        obj={obj}
                        index={index}
                        active={selected === obj}
                        disable={hovered === obj}
                        handlers={handlers}
                >
                        {grand}
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
                                color="#fff"
                                marginTop="6px"
                        >
                                <Tree tree={objectTree}>{render}</Tree>
                        </Flex>
                </Flex>
        )
}
