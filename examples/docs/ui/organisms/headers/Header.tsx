import * as React from 'react'
import { Flex, Drop } from '../../atoms'
import type { ReactNode } from 'react'
import type { EditorState, EditorType } from 'plre/types'
import { useCtx } from '../../ctx'
import { SwitchEditor } from './SwitchEditor'

export interface HeaderProps {
        children?: ReactNode
        editorItem: EditorState
}

export const Header = (props: HeaderProps) => {
        const { children, editorItem } = props

        const { editorTree } = useCtx()

        const handleClickEditor = (_type: EditorType) => {
                editorItem.type = _type
                editorTree.forceUpdate()
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
                        <SwitchEditor type={type} onClick={handleClickEditor} />
                        {children}
                </Flex>
        )
}
