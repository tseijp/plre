import * as React from 'react'
import { Flex } from '../../atoms'
import type { ReactNode } from 'react'
import type { ObjectTypes } from 'plre/types'

export interface ObjectTpesProps {
        children?: ReactNode
        onClick: (type: ObjectTypes) => void
}

export const ListObject = (props: ObjectTpesProps) => {
        const { onClick = () => {} } = props
        return (
                <Flex
                        gap="0.25rem"
                        color="white"
                        cursor="pointer"
                        padding="0.5rem"
                        alignItems="start"
                        borderRadius="3px"
                >
                        <div onClick={() => onClick('boxFrame')}>BoxFrame</div>
                        <div onClick={() => onClick('box')}>Box</div>
                        <div onClick={() => onClick('capsule')}>Capsule</div>
                        <div onClick={() => onClick('cone')}>Cone</div>
                        <div onClick={() => onClick('cube')}>Cube</div>
                        <div onClick={() => onClick('cylinder')}>Cylinder</div>
                        <div onClick={() => onClick('dodecahedron')}>
                                Dodecahedron
                        </div>
                        <div onClick={() => onClick('ellipsoid')}>
                                Ellipsoid
                        </div>
                        <div onClick={() => onClick('formula')}>Formula</div>
                        <div onClick={() => onClick('hexPrism')}>HexPrism</div>
                        <div onClick={() => onClick('icosahedron')}>
                                Icosahedron
                        </div>
                        <div onClick={() => onClick('link')}>Link</div>
                        <div onClick={() => onClick('octahedron')}>
                                Octahedron
                        </div>
                        <div onClick={() => onClick('octagonPrism')}>
                                OctagonPrism
                        </div>
                        <div onClick={() => onClick('plane')}>Plane</div>
                        <div onClick={() => onClick('pyramid')}>Pyramid</div>
                        <div onClick={() => onClick('sphere')}>Sphere</div>
                        <div onClick={() => onClick('tetrahedron')}>
                                Tetrahedron
                        </div>
                        <div onClick={() => onClick('torus')}>Torus</div>
                        <div onClick={() => onClick('triPrism')}>TriPrism</div>
                        <div onClick={() => onClick('U')}>U</div>
                        <div onClick={() => onClick('I')}>I</div>
                        <div onClick={() => onClick('S')}>S</div>
                        <div onClick={() => onClick('Material')}>Material</div>
                </Flex>
        )
}
