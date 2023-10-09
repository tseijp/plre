import * as React from 'react'
import { Drop, ATTACH_ICONS, useCall } from '../../atoms'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'
import { useCompile } from '../hooks'
import {
        addCollection,
        addMaterial,
        deactivateAll,
        deleteObject,
} from 'plre/control'
import { addFractal } from './fractal'
import { addLandscape } from './landscape'
import { getActiveObjects, isAddable } from 'plre/utils'
import { DropItems } from '../../molecules'
import { delConnectAll, initConnectAll, pubConnectAll } from 'plre/connect'
import { ObjectTypes } from 'plre/types'

type AttachObjectHandles = Record<keyof typeof ATTACH_ICONS, () => void>

export const AttachObject = () => {
        const { editorTree, objectTree } = useCtx()
        const compile = useCompile()

        const add = useCall((f, type: ObjectTypes) => {
                let objs = getActiveObjects(objectTree)
                if (objs.length <= 0) objs = [objectTree]
                objs.forEach((obj, i) => {
                        if (!isAddable(obj?.type, type)) obj = obj?.parent
                        if (!isAddable(obj?.type, type)) obj = obj?.parent
                        if (!isAddable(obj?.type, type)) return
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
                Delete() {
                        getActiveObjects(objectTree).forEach((obj) => {
                                deleteObject(obj)
                                delConnectAll(obj) // !!!!!!!!!!!!!!!!!!!!!!!!!!!
                        })
                        deactivateAll(objectTree)
                        editorTree.changeActive?.(null)
                        compile()
                },
                'Add Union'() {
                        add(addCollection, 'U')
                },
                'Add Subtraction'() {
                        add(addCollection, 'S')
                },
                'Add Intersection'() {
                        add(addCollection, 'I')
                },
                'Add Material'() {
                        add(addMaterial, 'Material')
                        deactivateAll(objectTree)
                },
                'Add Landscape'() {
                        add(addLandscape, 'object')
                },
                'Add Tetrahedron'() {
                        add(addFractal('tetrahedron'), 'object')
                },
                'Add MengerSponge'() {
                        add(addFractal('mengerSponge'), 'object')
                },
                'Add Mandelbulb'() {
                        add(addFractal('mandelbulb'), 'object')
                },
                'Add QuaternionMandelbrot'() {
                        add(addFractal('quaternionMandelbrot'), 'object')
                },
                'Add QuaternionJuliaSet'() {
                        add(addFractal('quaternionJuliaSet'), 'object')
                },
                'Add QuaternionSet'() {
                        add(addFractal('quaternionSet'), 'object')
                },
        })

        const render = (key: keyof typeof handles) => {
                const Icon = ATTACH_ICONS[key]
                return (
                        <div
                                onClick={() => handles[key]()}
                                key={key}
                                style={{
                                        gap: '0.5rem',
                                        width: '100%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                }}
                        >
                                {Icon && <Icon />}
                                {key}
                        </div>
                )
        }

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
