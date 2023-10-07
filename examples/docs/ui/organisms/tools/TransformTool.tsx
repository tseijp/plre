import * as React from 'react'
import { useState } from 'react'
import { Arrow, Box, Flex } from '../../atoms'
import { Slider } from '../../molecules'
import { isMaterial } from 'plre/utils'
import type { PL } from 'plre/types'
import { useTransform } from '../hooks'

export interface TransformToolProps {
        self: PL
}

export const TransformTool = (props: TransformToolProps) => {
        const { self } = props
        const [cache, handles] = useTransform(self)

        if (!cache.current) return null
        if (isMaterial(cache.current.type)) return null

        const { position: p, rotation: r, scale: s } = cache.current

        return (
                <Wrap>
                        <Flex alignItems="start" gap="1px">
                                <Box userSelect="none">Position:</Box>
                                <Slider X value={p[0]} onChange={handles.px} />
                                <Slider Y value={p[1]} onChange={handles.py} />
                                <Slider Z value={p[2]} onChange={handles.pz} />
                        </Flex>
                        <Flex alignItems="start" gap="1px">
                                <Box userSelect="none">Rotation:</Box>
                                <Slider X value={r[0]} onChange={handles.rx} />
                                <Slider Y value={r[1]} onChange={handles.ry} />
                                <Slider Z value={r[2]} onChange={handles.rz} />
                        </Flex>
                        <Flex alignItems="start" gap="1px">
                                <Box userSelect="none">Scale:</Box>
                                <Slider X value={s[0]} onChange={handles.sx} />
                                <Slider Y value={s[1]} onChange={handles.sy} />
                                <Slider Z value={s[2]} onChange={handles.sz} />
                        </Flex>
                </Wrap>
        )
}

const Wrap = ({ children }: { children: React.ReactNode }) => {
        const [isOpen, set] = useState(true)
        return (
                <Flex
                        fontSize="12px"
                        padding="0.25rem 0.5rem"
                        overflowY="scroll"
                >
                        <Box cursor="pointer" userSelect="none">
                                <div onClick={() => set((p) => !p)}>
                                        <Arrow
                                                d={!isOpen}
                                                fontSize={7}
                                                top={5}
                                                left={1}
                                        />
                                        <div style={{ marginLeft: 10 }}>
                                                Transform:
                                        </div>
                                </div>
                        </Box>
                        <Box display={isOpen ? '' : 'none'}>{children}</Box>
                </Flex>
        )
}
