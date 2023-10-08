import * as React from 'react'
import { Up } from '../../utils'
import { Drop, useCall } from '../../atoms'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'
import { useCompile } from '../hooks'
import {
        addCollection,
        addMaterial,
        deactivateAll,
        deleteObject,
} from 'plre/control'
import { getActiveObjects, isAddable } from 'plre/utils'
import { DropItems } from '../../molecules'
import { delConnectAll, initConnectAll, pubConnectAll } from 'plre/connect'
import { ObjectTypes } from 'plre/types'

interface AttachObjectHandles {
        delete(): void
        union(): void
        subtraction(): void
        intersection(): void
        material(): void
}

export const AttachObject = () => {
        const { editorTree, objectTree } = useCtx()
        const compile = useCompile()

        const add = useCall((f, type: ObjectTypes) => {
                getActiveObjects(objectTree).forEach((obj, i) => {
                        if (!isAddable(obj.type, type)) obj = obj.parent
                        if (!isAddable(obj.type, type)) obj = obj.parent
                        if (!isAddable(obj.type, type)) return
                        const child = f(obj, type)

                        initConnectAll(child)
                        pubConnectAll(child)

                        if (i !== 0) return
                        child.active = true
                        editorTree.changeActive?.(child)
                        compile()
                })
        })

        const handles = useMutable<AttachObjectHandles>({
                delete() {
                        getActiveObjects(objectTree).forEach((obj) => {
                                deleteObject(obj)
                                delConnectAll(obj) // !!!!!!!!!!!!!!!!!!!!!!!!!!!
                        })
                        deactivateAll(objectTree)
                        editorTree.changeActive?.(null)
                        compile()
                },
                union() {
                        add(addCollection, 'U')
                },
                subtraction() {
                        add(addCollection, 'S')
                },
                intersection() {
                        add(addCollection, 'I')
                },
                material() {
                        add(addMaterial, 'Material')
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
