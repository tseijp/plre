import * as React from 'react'
import { Flex } from '../atoms'
import { AddObject, AttachObject, Header } from './headers'
import { useViewport } from './hooks'
import { Viewpoint } from '../molecules'
import { ErrorMessage } from './ErrorMessage'
import type { EditorState } from 'plre/types'

export interface ViewportProps {
        editorItem: EditorState
}

export const Viewport = (props: ViewportProps) => {
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
                        </Header>
                        <Flex background="#3A3A3A">
                                <canvas ref={wheel.ref} />
                        </Flex>
                        <Viewpoint s={16} wheel={wheel} />
                        <ErrorMessage self={self} />
                </Flex>
        )
}
