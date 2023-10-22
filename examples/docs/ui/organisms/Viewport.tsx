import * as React from 'react'
import { Flex } from '../atoms'
import { AddObject, AttachObject, Header } from './headers'
import { useViewport } from './hooks'
import { Viewpoint, ZoomIn, ZoomOut } from '../molecules'
import { ErrorMessage } from './ErrorMessage'
import { Tools } from './tools'
import { useCtx } from '../ctx'
import type { EditorState } from 'plre/types'

export interface ViewportProps {
        editorItem: EditorState
}

export const Viewport = (props: ViewportProps) => {
        const { editorItem } = props
        const { isReady } = useCtx()
        if (isReady) return <ViewportImpl {...props} />

        return (
                <Flex backgroundColor="#303030" transformStyle="preserve-3d">
                        <Header editorItem={editorItem}>
                                <AddObject />
                                <AttachObject />
                                {/* <OpenRecent /> */}
                        </Header>
                        <Tools self={{} as any} />
                        <Flex background="#3A3A3A" />
                </Flex>
        )
}

const ViewportImpl = (props: ViewportProps) => {
        const { editorItem } = props
        const [wheel, resize, self] = useViewport()

        return (
                <Flex
                        ref={resize.ref}
                        backgroundColor="#303030"
                        transformStyle="preserve-3d"
                >
                        <Header editorItem={editorItem}>
                                <AddObject />
                                <AttachObject />
                                {/* <OpenRecent /> */}
                        </Header>
                        <Flex background="#3A3A3A">
                                <canvas ref={wheel.ref} />
                        </Flex>
                        <Tools self={self} />
                        <Viewpoint s={16} wheel={wheel} />
                        <ZoomIn wheel={wheel} />
                        <ZoomOut wheel={wheel} />
                        <ErrorMessage self={self} />
                </Flex>
        )
}
