import * as React from 'react'
import { Flex } from '../atoms'
import { Header } from './headers/Header'
import { CompileStart } from './headers'
import { useCodemirror } from './hooks'
import type { EditorState } from 'plre/types'

export interface PropertiesProps {
        editorItem: EditorState
}

export const Properties = (props: PropertiesProps) => {
        const { ...headerProps } = props
        const self = useCodemirror()

        return (
                <Flex background="#303030">
                        <Header {...headerProps}>
                                <CompileStart />
                        </Header>
                        <Flex ref={self.ref} />
                </Flex>
        )
}
