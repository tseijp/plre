import * as React from 'react'
import { Flex } from '../atoms'
import { useViewport } from './hooks'
import { Header, Viewpoint } from '../molecules'
import type { EditorState } from 'plre/types'

export interface ViewportProps {
        editorTree: EditorState
        editorItem: EditorState
}

export const Viewport = (props: ViewportProps) => {
        const { ...headerProps } = props
        const [wheel, resize, self] = useViewport()

        return (
                <Flex
                        ref={resize.ref}
                        backgroundColor="#303030"
                        transformStyle="preserve-3d"
                >
                        <Header {...headerProps} />
                        <Flex background="#3A3A3A">
                                <canvas ref={self.ref} />
                        </Flex>
                        <Viewpoint s={16} wheel={wheel} />
                </Flex>
        )
}
