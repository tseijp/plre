import frame from 'refr'
import { useCtx } from '../../ctx'
import { collectAll } from 'plre/compile'
import { compress, deCompress, decode, encode } from './utils'
import type { EditorState, PLObject } from 'plre/types'
import { exportCache, importCache } from 'plre/cache'

export const useCompile = () => {
        const { editorTree, objectTree } = useCtx()
        return () => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(objectTree)
                editorTree.compileShader?.(code)
                editorTree.forceUpdate?.()
                console.log({
                        export: exportCache(objectTree),
                        encode: encode(objectTree),
                        import: importCache(exportCache(objectTree)),
                        decode: decode(encode(objectTree)),
                })
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
