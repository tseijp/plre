import * as React from 'react'
import { Flex, Tree, useOnce } from '../atoms'
import { Header, LayerItem } from '../molecules'
import { PLObject } from 'plre/types'
import { useViewLayer } from './hooks'
import { useLayout } from '../ctx'
import type { ReactNode } from 'react'
import type { EditorState } from 'plre/types'
import { sortObject } from './utils'

export interface ViewLayerProps {
        editorItem: EditorState
}
export const ViewLayer = (props: ViewLayerProps) => {
        const { editorItem } = props
        const { objectTree } = useLayout()
        const { selected, hovered, handlers } = useViewLayer(objectTree)

        // useOnce(() => sortObject(objectTree))

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
                        <Header editorItem={editorItem} />
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
