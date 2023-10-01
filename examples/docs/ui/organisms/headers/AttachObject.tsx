import * as React from 'react'
import { Up } from '../../utils'
import { Drop } from '../../atoms'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'
import { useCompile } from '../hooks'
import { addMaterial, deactivateAll, deleteObject } from 'plre/control'
import { getActiveObjects, isObject } from 'plre/utils'
import { DropItems } from '../../molecules'
import { delAll, pub } from 'plre/connect'

interface AttachObjectHandles {
        delete(): void
        'attach Material'(): void
}

export const AttachObject = () => {
        const { editorTree, objectTree } = useCtx()
        const compile = useCompile()

        const handles = useMutable<AttachObjectHandles>({
                delete() {
                        getActiveObjects(objectTree).forEach((obj) => {
                                deleteObject(obj)
                                // delAll(obj) !!!!!!!!!!!!!!!!!!!!!!!!!!!
                        })
                        deactivateAll(objectTree)
                        editorTree.changeActive?.(null)
                        compile()
                },
                'attach Material'() {
                        getActiveObjects(objectTree).forEach((obj, i) => {
                                if (!isObject(obj)) return
                                const child = addMaterial(obj)
                                // pub(child) !!!!!!!!!!!!!!!!!!!!!!!!!!!
                                if (i === 0) {
                                        child.active = true
                                        editorTree.changeActive?.(child)
                                }
                        })
                        deactivateAll(objectTree)
                        compile()
                },
        })

        const render = (key: keyof typeof handles) => (
                <div
                        onClick={() => handles[key]()}
                        key={key}
                        style={{
                                width: '100%',
                                cursor: 'pointer',
                        }}
                >
                        {Up(key)}
                </div>
        )

        return (
                <Drop>
                        <span
                                style={{
                                        height: 18,
                                        padding: '0 0.25rem',
                                        textAlign: 'center',
                                }}
                        >
                                Object
                        </span>
                        <DropItems items={Object.keys(handles)}>
                                {render}
                        </DropItems>
                </Drop>
        )
}
