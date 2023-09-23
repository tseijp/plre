import * as React from 'react'
import { Flex } from '../atoms'
import { Header } from '../molecules'
import type { EditorState } from 'plre/types'

export interface TimelineProps {
        editorItem: EditorState
}

export const Timeline = (props: TimelineProps) => {
        const { editorItem } = props
        return (
                <Flex backgroundColor="#303030">
                        <Header editorItem={editorItem} />
                        <Flex backgroundColor="#3A3A3A"></Flex>
                </Flex>
        )
}
