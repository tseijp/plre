import * as React from 'react'
import { useEffect, useState } from 'react'
import { Arrow, Box, Flex, useCall, useForceUpdate, useOnce } from '../../atoms'
import { Slider } from '../../molecules'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'
import { getActiveObjects, isMaterial } from 'plre/utils'
import type { PL } from 'plre/types'
import { uniformMat4 } from 'plre/utils'

const toNum = (a: string | number) => {
        if (typeof a === 'number') return a
        return parseFloat(a)
}

const isNum = (a: unknown): a is number => typeof a === 'number' && !isNaN(a)

const isFun = (a: unknown): a is Function => typeof a === 'function'

export interface TransformToolProps {
        self: PL
}

export const TransformTool = (props: TransformToolProps) => {
        const { self } = props
        const { editorTree, objectTree } = useCtx()
        const forceUpdate = useForceUpdate()
        const [obj, set] = useState(() => getActiveObjects(objectTree)[0])
        const cache = useOnce(() => ({ current: obj, previous: null }))

        const change = (
                value: number,
                arr: number[],
                i: number,
                key: string,
                isRoot?: boolean
        ) => {
                // listenner has undefined value
                forceUpdate()
                self.on()
                value = toNum(isFun(value) ? value(arr[i]) : value)
                if (!isNum(value)) return
                arr[i] = value
                const obj = cache.current
                if (obj) uniformMat4(self, obj)
                if (isRoot && obj[key]) obj[key](value, false)
                if (isRoot && obj.memo.ymap) obj.memo.ymap.set(key, value)
        }

        const handles = useMutable<any>({
                px(value?: number, isRoot?: boolean) {
                        const { position } = cache.current
                        change(value, position, 0, 'px', isRoot)
                },
                py(value?: number, isRoot?: boolean) {
                        const { position } = cache.current
                        change(value, position, 1, 'py', isRoot)
                },
                pz(value?: number, isRoot?: boolean) {
                        const { position } = cache.current
                        change(value, position, 2, 'pz', isRoot)
                },
                rx(value?: number, isRoot?: boolean) {
                        const { rotation } = cache.current
                        change(value, rotation, 0, 'rx', isRoot)
                },
                ry(value?: number, isRoot?: boolean) {
                        const { rotation } = cache.current
                        change(value, rotation, 1, 'ry', isRoot)
                },
                rz(value?: number, isRoot?: boolean) {
                        const { rotation } = cache.current
                        change(value, rotation, 2, 'rz', isRoot)
                },
                sx(value?: number, isRoot?: boolean) {
                        const { scale } = cache.current
                        change(value, scale, 0, 'sx', isRoot)
                },
                sy(value?: number, isRoot?: boolean) {
                        const { scale } = cache.current
                        change(value, scale, 1, 'sy', isRoot)
                },
                sz(value?: number, isRoot?: boolean) {
                        const { scale } = cache.current
                        change(value, scale, 2, 'sz', isRoot)
                },
        })

        const changeActive = useCall((next) => {
                // cache to save changed code
                cache.previous = cache.current
                cache.current = next
                set(() => next)
        })

        useEffect(() => {
                // @ts-ignore
                if (obj) obj(handles)
                return () => {
                        // @ts-ignore
                        if (obj) obj(handles)
                }
        }, [obj])

        // @ts-ignore
        useOnce(() => editorTree({ changeActive }))

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
