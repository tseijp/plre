import * as React from 'react'
import { Flex } from '../atoms'
import { Header } from '../molecules'
import { useCodemirror } from './hooks'
import type { EditorState } from '../molecules'

export interface PropertiesProps {
        editorTree: EditorState
        editorItem: EditorState
}

export const Properties = (props: PropertiesProps) => {
        const { ...headerProps } = props
        const self = useCodemirror()
        return (
                <Flex background="#303030">
                        <Header {...headerProps} />
                        <Flex ref={self.ref} />
                </Flex>
        )
}
