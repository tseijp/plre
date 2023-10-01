import * as React from 'react'
import frame from 'refr'
import { useCtx } from '../../ctx'
import { LayerItemIcon } from '../../molecules'
import { collectAll } from 'plre/compile'
import { resolve } from '../lygia'

export const CompileStart = () => {
        const { objectTree, editorTree } = useCtx()
        const handleClick = async () => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(objectTree)
                code = await resolve(code)
                objectTree.compileShader?.(code)
                editorTree.update?.()
        }

        return (
                <div style={{ cursor: 'pointer' }} onClick={handleClick}>
                        <LayerItemIcon active children="▶️" />
                </div>
        )
}
