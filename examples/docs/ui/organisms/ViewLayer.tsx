import * as React from 'react'
import { ObjectState } from 'plre/types'
import { Header } from './headers/Header'
import { Flex, Tree } from '../atoms'
import { useViewLayer } from './hooks'
import { useCtx } from '../ctx'
import { AddObject, AttachObject } from './headers'
import { LayerItem } from './layers'
import type { ReactNode } from 'react'
import type { EditorState } from 'plre/types'

export interface ViewLayerProps {
        editorItem: EditorState
}
export const ViewLayer = (props: ViewLayerProps) => {
        const { editorItem } = props
        const { objectTree, isReady } = useCtx()
        const { selected, hovered, handlers } = useViewLayer()

        // useOnce(() => sortObject(objectTree))

        const render = (obj: ObjectState, grand: ReactNode, index = 0) => (
                <LayerItem
                        /**
                         * Mismatch occurs if yjs create and delete at the same time,
                         * the obj is not updated and the old obj is referred to.
                         */
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
                        <Header editorItem={editorItem}>
                                <AddObject />
                                <AttachObject />
                        </Header>
                        <Flex
                                // backgroundImage="linear-gradient(0deg, #ffff00 50%, #0000ff 50%)"
                                backgroundImage="linear-gradient(0deg, #282828 50%, #2B2B2B 50%)"
                                backgroundSize="40px 40px"
                                marginTop="6px"
                                alignItems="start"
                                justifyContent="start"
                                color="#fff"
                        >
                                {isReady && (
                                        <Tree tree={objectTree}>{render}</Tree>
                                )}
                        </Flex>
                </Flex>
        )
}
