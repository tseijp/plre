import * as React from 'react'
import { Flex, Drop } from '../../atoms'
import { ListEditor } from './ListEditor'
import type { ReactNode } from 'react'
import type { EditorState, EditorType } from 'plre/types'
import { useCtx } from '../../ctx'

export interface HeaderProps {
        children?: ReactNode
        editorItem: EditorState
}

export const Header = (props: HeaderProps) => {
        const { children, editorItem } = props

        const { editorTree } = useCtx()

        const handleClickEditor = (_type: EditorType) => {
                editorItem.type = _type
                editorTree.update()
        }

        const type = editorItem.type[0].toUpperCase()

        return (
                <Flex
                        row
                        gap="1rem"
                        height="25px"
                        overflow="visible"
                        justifyContent="start"
                        paddingLeft="6px"
                        color="#fff"
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
                                <ListEditor onClick={handleClickEditor} />
                        </Drop>
                        {children}
                </Flex>
        )
}
