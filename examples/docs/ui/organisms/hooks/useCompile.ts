import frame from 'refr'
import { useCtx } from '../../ctx'
import { collectAll } from 'plre/compile'
import type { EditorState, PLObject } from 'plre/types'

export const useCompile = () => {
        const { editorTree, objectTree } = useCtx()
        return () => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(objectTree)
                editorTree.compileShader?.(code)
                editorTree.forceUpdate?.()
        }
}

export const useCompile_ = (objectTree: PLObject, editorTree: EditorState) => {
        return () => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(objectTree)
                editorTree.compileShader?.(code)
                editorTree.forceUpdate?.()
        }
}
