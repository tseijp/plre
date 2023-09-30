import * as React from 'react'
import { Flex } from '../atoms'
import { useViewport } from './hooks'
import { Header, Viewpoint } from '../molecules'
import type { EditorState } from 'plre/types'

export interface ViewportProps {
        editorItem: EditorState
}

export const Viewport = (props: ViewportProps) => {
        const { editorItem } = props
        const [wheel, resize] = useViewport()

        return (
                <Flex
                        ref={resize.ref}
                        backgroundColor="#303030"
                        transformStyle="preserve-3d"
                >
                        <Header editorItem={editorItem} />
                        <Flex background="#3A3A3A">
                                <canvas ref={wheel.ref} />
                        </Flex>
                        <Viewpoint s={16} wheel={wheel} />
                </Flex>
        )
}
