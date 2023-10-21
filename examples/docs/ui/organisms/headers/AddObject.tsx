import * as React from 'react'
import * as Objects from 'plre/objects'
import { Up } from '../../utils'
import { Drop, OBJECT_ICONS } from '../../atoms'
import { useCtx } from '../../ctx'
import { useCompile } from '../hooks'
import { addObject, deactivateAll } from 'plre/control'
import { getActiveObjects, isAddable } from 'plre/utils'
import { DropItems, HeaderButton, HeaderItem } from '../../molecules'
import { initConnectAll, pubConnectAll, subConnectAll } from 'plre/connect'
import type { ObjectTypes } from 'plre/types'

const objectTypes = Object.keys(Objects) as ObjectTypes[]

export const AddObject = () => {
        const { editorTree, objectTree, storage } = useCtx()
        const compile = useCompile()

        // @TODO useAsync
        const handleClick = async (type: ObjectTypes) => {
                let objs = getActiveObjects(objectTree)
                if (objs.length <= 0) objs = [objectTree]
                objs.forEach((obj, i) => {
                        if (!isAddable(obj?.type, type)) obj = obj?.parent
                        if (!isAddable(obj?.type, type)) obj = obj?.parent
                        if (!isAddable(obj?.type, type)) return
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

                // Cache only own changes in localStorage
                storage.isCacheable = true

                compile()
        }

        const render = (type: ObjectTypes) => {
                const Icon = OBJECT_ICONS[type]
                return (
                        <HeaderItem
                                onClick={() => handleClick(type)}
                                key={type}
                        >
                                {Icon && <Icon />}
                                {Up(type)}
                        </HeaderItem>
                )
        }

        return (
                <Drop>
                        <HeaderButton>Add</HeaderButton>
                        <DropItems items={objectTypes}>{render}</DropItems>
                </Drop>
        )
}
