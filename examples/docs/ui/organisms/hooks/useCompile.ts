import frame from 'refr'
import { useCtx } from '../../ctx'
import { collectAll } from 'plre/compile'

import type { EditorState, ObjectState } from 'plre/types'
import { useCall } from '../../atoms'

export const useCompile = () => {
        const { editorTree, objectTree } = useCtx()
        return useCall(() => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(objectTree)
                editorTree.compileShader?.(code)
                editorTree.forceUpdate?.()
        })
}

export const useCompile_ = (
        objectTree: ObjectState,
        editorTree: EditorState
) => {
        return useCall((_objectTree = objectTree, _editorTree = editorTree) => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(_objectTree)
                _editorTree.compileShader?.(code)
                _editorTree.forceUpdate?.()
        })
}
