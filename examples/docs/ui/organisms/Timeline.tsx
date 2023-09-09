import * as React from 'react'
import { Flex } from '../atoms'
import { Header } from '../molecules'
import type { EditorState } from 'plre/types'

export interface TimelineProps {
        editorTree: EditorState
        editorItem: EditorState
}

export const Timeline = (props: TimelineProps) => {
        const { ...headerProps } = props
        return (
                <Flex backgroundColor="#303030">
                        <Header {...headerProps} />
                        <Flex backgroundColor="#3A3A3A"></Flex>
                </Flex>
        )
}
