import * as React from 'react'
import { Up } from '../../utils'
import { Drop } from '../../atoms'
import { useCtx } from '../../ctx'
import { useCompile } from '../hooks'
import { addObject, deactivateAll } from 'plre/control'
import { getActiveObjects, isCollection } from 'plre/utils'
import { DropItems } from '../../molecules'
import { initConnectAll, pubConnectAll, subConnectAll } from 'plre/connect'
import * as Objects from 'plre/objects'
import type { ObjectTypes } from 'plre/types'

const objectTypes = Object.keys(Objects) as ObjectTypes[]

export const AddObject = () => {
        const { editorTree, objectTree } = useCtx()
        const compile = useCompile()

        // @TODO useAsync
        const handleClick = async (type: ObjectTypes) => {
                let objs = getActiveObjects(objectTree)
                if (objs.length <= 0) objs = [objectTree]
                objs.forEach((obj, i) => {
                        if (!isCollection(obj.type)) obj = obj.parent
                        if (!isCollection(obj.type)) obj = obj.parent
                        if (!isCollection(obj.type)) return
                        const child = addObject(obj, type)

                        initConnectAll(child)
                        pubConnectAll(child)
                        subConnectAll(child)

                        if (i === 0) {
                                child.active = true
                                editorTree.changeActive?.(child)
                        }
                })
                deactivateAll(objectTree)
                compile()
        }

        const render = (type: ObjectTypes) => (
                <div
                        onClick={() => handleClick(type)}
                        key={type}
                        style={{
                                width: '100%',
                                cursor: 'pointer',
                        }}
                >
                        {Up(type)}
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
                                Add
                        </span>
                        <DropItems items={objectTypes}>{render}</DropItems>
                </Drop>
        )
}
