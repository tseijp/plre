import * as React from 'react'
import { Flex } from '../atoms'
import { Header, LayerItemIcon } from '../molecules'
import { useCodemirror } from './hooks'
import type { EditorState } from 'plre/types'
import { useCtx } from '../ctx'
import { collectAll } from 'plre/utils'

export interface PropertiesProps {
        editorItem: EditorState
}

export const Properties = (props: PropertiesProps) => {
        const { ...headerProps } = props
        const self = useCodemirror()
        const { objectTree } = useCtx()
        const handleClick = () => {
                alert('compiled')
                console.log(collectAll(objectTree))
        }

        return (
                <Flex background="#303030">
                        <Header {...headerProps}>
                                <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleClick}
                                >
                                        <LayerItemIcon active children="▶️" />
                                </div>
                        </Header>
                        <Flex ref={self.ref} />
                </Flex>
        )
}
