import { useEffect, useState } from 'react'
import { useCall, useForceUpdate, useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'
import { setTransformFromKey, uniformMat4 } from 'plre/utils'
import { getActiveObjects } from 'plre/utils'
import type { PL, PLObject } from 'plre/types'

const toNum = (a: string) => parseFloat(a)
const isStr = (a: unknown): a is string => typeof a === 'string'

type Value = number | ((prev: number) => number)

export const useTransform = (self: PL) => {
        const { editorTree, objectTree } = useCtx()
        const updateUniform = useForceUpdate()
        const [obj, set] = useState(() => getActiveObjects(objectTree)[0])
        const cache = useOnce(() => ({ current: obj, previous: null }))
        const changeValue = useCall((key: string, value: Value | string) => {
                const obj = cache.current
                if (!obj) return

                if (isStr(value)) value = toNum(value)
                value = setTransformFromKey(obj, key, value)

                // effect to other Viewport and other users
                editorTree.updateUniform(obj)
                obj?.memo.ymap?.set(key, value)
        })

        const handles = useMutable<any>({
                px: (value: Value | string) => changeValue('px', value),
                py: (value: Value | string) => changeValue('py', value),
                pz: (value: Value | string) => changeValue('pz', value),
                rx: (value: Value | string) => changeValue('rx', value),
                ry: (value: Value | string) => changeValue('ry', value),
                rz: (value: Value | string) => changeValue('rz', value),
                sx: (value: Value | string) => changeValue('sx', value),
                sy: (value: Value | string) => changeValue('sy', value),
                sz: (value: Value | string) => changeValue('sz', value),
        })

        const changeActive = useCall((next) => {
                // cache to save changed code
                cache.previous = cache.current
                cache.current = next
                set(() => next)
        })

        useEffect(() => {
                // @ts-ignore
                editorTree({ updateUniform, changeActive })
                return () => {
                        // @ts-ignore
                        editorTree({ updateUniform, changeActive })
                }
        }, [obj])

        return [cache, handles] as const
}
