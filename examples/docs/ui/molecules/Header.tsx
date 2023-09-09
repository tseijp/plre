import * as React from 'react'
import { Flex, Drop } from '../atoms'
import { EditorTypes } from './EditorTypes'
import type { ReactNode } from 'react'
import type { EditorState, EditorType } from 'plre/types'

export interface HeaderProps {
        children?: ReactNode
        editorTree: EditorState
        editorItem: EditorState
}

export const Header = (props: HeaderProps) => {
        const { children, editorTree, editorItem } = props
        const handleClick = (_type: EditorType) => {
                editorItem.type = _type
                editorTree.update()
        }

        const type = editorItem.type[0].toUpperCase()

        return (
                <Flex
                        height="25px"
                        overflow="visible"
                        alignItems="start"
                        paddingLeft="6px"
                >
                        <Drop marginTop="2px">
                                <span
                                        style={{
                                                width: 18,
                                                height: 18,
                                                textAlign: 'center',
                                        }}
                                >
                                        {type}
                                </span>
                                <EditorTypes onClick={handleClick} />
                        </Drop>
                        {children}
                </Flex>
        )
}
