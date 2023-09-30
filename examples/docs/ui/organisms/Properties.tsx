import * as React from 'react'
import { Flex } from '../atoms'
import { frame } from 'refr'
import { Header, LayerItemIcon } from '../molecules'
import { useCodemirror } from './hooks'
import type { EditorState } from 'plre/types'
import { useCtx } from '../ctx'
import { collectAll } from 'plre/compile'

export interface PropertiesProps {
        editorItem: EditorState
}

export const Properties = (props: PropertiesProps) => {
        const { ...headerProps } = props
        const self = useCodemirror()
        const { objectTree } = useCtx()
        const handleClick = () => {
                // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                frame.clear()
                const code = collectAll(objectTree)
                objectTree.compileShader(code)
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
