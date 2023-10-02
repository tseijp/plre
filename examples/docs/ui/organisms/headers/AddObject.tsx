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
                        if (!isCollection(obj)) obj = obj.parent
                        if (!isCollection(obj)) obj = obj.parent
                        if (!isCollection(obj)) return
                        const child = addObject(obj, type)
                        initConnectAll(child)
                        pubConnectAll(child)
                        setTimeout(() => {
                                subConnectAll(child)
                        }, 10000)
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
                        {/* <Flex
                                gap="0.25rem"
                                color="white"
                                cursor="pointer"
                                padding="0.5rem"
                                alignItems="start"
                                borderRadius="3px"
                        >
                                <div onClick={() => handleClick('boxFrame')}>
                                        BoxFrame
                                </div>
                                <div onClick={() => handleClick('box')}>
                                        Box
                                </div>
                                <div onClick={() => handleClick('capsule')}>
                                        Capsule
                                </div>
                                <div onClick={() => handleClick('cone')}>
                                        Cone
                                </div>
                                <div onClick={() => handleClick('cube')}>
                                        Cube
                                </div>
                                <div onClick={() => handleClick('cylinder')}>
                                        Cylinder
                                </div>
                                <div
                                        onClick={() =>
                                                handleClick('dodecahedron')
                                        }
                                >
                                        Dodecahedron
                                </div>
                                <div onClick={() => handleClick('ellipsoid')}>
                                        Ellipsoid
                                </div>
                                <div onClick={() => handleClick('formula')}>
                                        Formula
                                </div>
                                <div onClick={() => handleClick('hexPrism')}>
                                        HexPrism
                                </div>
                                <div onClick={() => handleClick('icosahedron')}>
                                        Icosahedron
                                </div>
                                <div onClick={() => handleClick('link')}>
                                        Link
                                </div>
                                <div onClick={() => handleClick('octahedron')}>
                                        Octahedron
                                </div>
                                <div
                                        onClick={() =>
                                                handleClick('octagonPrism')
                                        }
                                >
                                        OctagonPrism
                                </div>
                                <div onClick={() => handleClick('plane')}>
                                        Plane
                                </div>
                                <div onClick={() => handleClick('pyramid')}>
                                        Pyramid
                                </div>
                                <div onClick={() => handleClick('sphere')}>
                                        Sphere
                                </div>
                                <div onClick={() => handleClick('tetrahedron')}>
                                        Tetrahedron
                                </div>
                                <div onClick={() => handleClick('torus')}>
                                        Torus
                                </div>
                                <div onClick={() => handleClick('triPrism')}>
                                        TriPrism
                                </div>
                                <div onClick={() => handleClick('U')}>U</div>
                                <div onClick={() => handleClick('I')}>I</div>
                                <div onClick={() => handleClick('S')}>S</div>
                                <div onClick={() => handleClick('Material')}>
                                        Material
                                </div>
                        </Flex> */}
                </Drop>
        )
}
