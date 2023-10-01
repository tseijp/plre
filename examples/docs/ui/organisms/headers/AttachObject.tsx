import * as React from 'react'
import { Up } from '../../utils'
import { Drop } from '../../atoms'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'
import { useCompile } from '../hooks'
import { deleteObject } from '../utils'
import { getActiveObjects } from 'plre/utils'
import { DropItems } from '../../molecules'

interface AttachObjectHandles {
        delete(): void
}

export const AttachObject = () => {
        const { editorTree, objectTree } = useCtx()
        const compile = useCompile()

        const handles = useMutable<AttachObjectHandles>({
                delete() {
                        getActiveObjects(objectTree).forEach(deleteObject)
                        editorTree.changeActive?.(null)
                        compile()
                },
        })

        return (
                <Drop>
                        <span
                                style={{
                                        width: 54,
                                        height: 18,
                                        textAlign: 'center',
                                }}
                        >
                                Object
                        </span>
                        <DropItems items={Object.keys(handles)}>
                                {(key) => (
                                        <div onClick={() => handles[key]()}>
                                                {Up(key)}
                                        </div>
                                )}
                        </DropItems>
                </Drop>
        )
}
