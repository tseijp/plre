import frame from 'refr'
import { useCtx } from '../../ctx'
import { resolve } from '../lygia'
import { collectAll } from 'plre/compile'

export const useCompile = () => {
        const { objectTree, editorTree } = useCtx()
        return async () => {
                frame.clear() // @TODO FIX: current cannot stop glre render: `frame(() => self.render() || 1)`
                let code = collectAll(objectTree)
                code = await resolve(code)
                objectTree.compileShader?.(code)
                editorTree.update?.()
        }
}
