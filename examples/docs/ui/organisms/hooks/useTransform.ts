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
        const forceUpdate = useForceUpdate()
        const [obj, set] = useState(() => getActiveObjects(objectTree)[0])
        const cache = useOnce(() => ({ current: obj, previous: null }))

        // const change = (s
        //         value: number,
        //         arr: number[],
        //         i: number,
        //         key: string,
        //         isRoot?: boolean
        // ) => {
        //         const obj = cache.current
        //         // set value from listenned for slider drag or subscribe
        //         if (!isNum(value)) return
        //         if (isRoot) arr[i] = value

        //         // update UI
        //         forceUpdate()

        //         // set matrix uniform and rerender via self.on()

        //         value = toNum(isFun(value) ? value(arr[i]) : value)

        //         // effect to other Viewport and other users
        //         if (isRoot) {
        //                 obj?.[key + 'Update']?.(value, false)
        //                 obj?.memo.ymap?.set(key, value)
        //                 editorTree.updateUniform(obj!) // uniformMat4(self, obj)
        //         }
        // }
        const updateUniform = useCall(() => {
                forceUpdate()
        })

        const changeValue = (key: string, value: Value | string) => {
                const obj = cache.current
                if (!obj) return

                if (isStr(value)) value = toNum(value)
                value = setTransformFromKey(obj, key, value)

                // effect to other Viewport and other users
                editorTree.updateUniform(obj)
                obj?.memo.ymap?.set(key, value)
        }

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
                // if (obj) obj(handles)
                return () => {
                        // @ts-ignore
                        editorTree({ updateUniform, changeActive })
                        // if (obj) obj(handles)
                }
        }, [obj])

        return [cache, handles] as const
}
