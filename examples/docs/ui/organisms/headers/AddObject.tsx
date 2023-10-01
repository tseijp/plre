import * as React from 'react'
import * as ObjectShaders from './objects'
import { Drop, useCall } from '../../atoms'
import { useCtx } from '../../ctx'
import { ListObject } from './ListObject'
import { createObject } from 'plre'
import { resolve } from '../lygia'
import { attachParent, getActiveObjects, getLayerKey } from 'plre/utils'
import type { ObjectTypes } from 'plre/types'
import { collectAll } from 'plre/compile'

export const AddObject = () => {
        const { objectTree, editorTree } = useCtx()

        // @TODO useAsync
        const handleClick = async (type: ObjectTypes) => {
                getActiveObjects(objectTree).forEach((obj) => {
                        const shader = ObjectShaders[type]
                        const child = createObject(type)
                        if (!shader) throw Error(`No shader for ${type}`)
                        obj.children.push(child)
                        attachParent(obj)
                        const _key = getLayerKey(child)
                        child.shader = shader(_key)
                })
                let code = collectAll(objectTree)
                code = await resolve(code)
                console.log(code)
                objectTree.compileShader?.(code)
                editorTree.update?.()
        }

        return (
                <Drop>
                        <span
                                style={{
                                        width: 36,
                                        height: 18,
                                        textAlign: 'center',
                                }}
                        >
                                Add
                        </span>
                        <ListObject onClick={handleClick} />
                </Drop>
        )
}
