import { attachParent, getLayerKey, isIgnoreProp } from './utils'
import { PLObject } from './types'
import { createObject } from '.'
import { deleteObject } from './control'

export const initConnect = (
        obj: PLObject,
        _ydoc?: any,
        forceUpdate = () => {}
) => {
        const { children, parent, memo } = obj
        const _key = getLayerKey(obj)

        memo.forceUpdate = parent?.memo.forceUpdate || forceUpdate
        const ydoc = (memo.ydoc = parent?.memo.ydoc || _ydoc)
        const ymap = (memo.ymap = ydoc.getMap(_key))
        const yarr = (memo.yarr = ydoc.getMap(_key + '_'))

        for (const key in obj) {
                const value = ymap.get(key)
                if (value === void 0) continue
                if (isIgnoreProp(value, key)) continue
                obj[key] = value
        }

        yarr.forEach((type: string) => {
                // @TODO FIX if type is multipled
                let child = children.find((c) => c.type === type)
                if (type) {
                        if (child) return
                        child = createObject(type as any)
                        children.push(child)
                        attachParent(obj)
                        initConnect(child)
                        subConnect(child)
                } else {
                        if (!child) return
                        deleteObject(child)
                }
        })

        // debug
        if (!memo._init) memo._init = 0
        memo._init++
}

export const pubConnect = (obj: PLObject) => {
        const { children, memo } = obj
        const { ymap, yarr } = memo

        for (const key in obj) {
                const value = obj[key]
                if (isIgnoreProp(value, key)) continue
                ymap.set(key, value)
        }

        children.forEach((child) => {
                const key = getLayerKey(child)
                yarr.set(key, child.type)
        })

        // debug
        if (!memo._pub) memo._pub = 0
        memo._pub++
        console.log('plre/conenct pub', { ...obj })
}

export const delConnect = (obj: PLObject) => {
        const { parent, memo } = obj
        const { ymap, yarr } = memo

        for (const key in obj) {
                if (isIgnoreProp(obj[key], key)) continue
                ymap.set(key, void 0)
        }

        yarr.forEach((key: string) => {
                yarr.set(key, void 0)
        })

        const _key = getLayerKey(obj)

        parent.memo.yarr.set(_key, void 0)

        memo.unobserveListener?.forEach((f: any) => f())

        // debug
        if (!memo._del) memo._del = 0
        memo._del++
        console.log('plre/conenct del', { ...obj })
}

export const subConnect = (obj: PLObject) => {
        const { memo, children } = obj
        const { ymap, yarr, forceUpdate } = memo

        const _yarr = (e: any) => {
                if (e.transaction.local) return

                // debug
                if (!memo._yarr) memo._yarr = 0
                memo._yarr++

                e.changes.keys.forEach((_: any, key: string) => {
                        const type = yarr.get(key)
                        console.log(
                                `plre/conenct sub _yarr { key: ${key}, type: ${type} } `,
                                _
                        )
                        if (type) {
                                // create object
                                const child = createObject(type)
                                children.push(child)
                                attachParent(obj)
                                initConnect(child)
                                subConnect(child)
                                forceUpdate()
                                return
                        }
                        // delete object
                        const child = children.find(
                                (c) => getLayerKey(c) === key
                        )
                        if (child) {
                                deleteObject(child)
                                forceUpdate()
                        }
                })
        }

        const _ymap = (e: any) => {
                if (e.transaction.local) return

                if (!memo.ymap) memo._ymap = 0
                memo._ymap++

                e.changes.keys.forEach((_: any, key: string) => {
                        const value = ymap.get(key)
                        // prettier-ignore
                        console.log(`plre/conenct sub _ymap { key: ${key}, value: ${value} }`)
                        if (isIgnoreProp(value, key)) return
                        obj[key] = value
                        forceUpdate()
                })
        }
        yarr.observe(_yarr)
        ymap.observe(_ymap)
        if (!memo.unobserveListener) memo.unobserveListener = new Set()
        memo.unobserveListener.add(() => yarr.unobserve(_yarr))
        memo.unobserveListener.add(() => ymap.unobserve(_ymap))

        // debug
        if (!memo._sub) memo._sub = 0
        memo._sub++
}

export const initConnectAll = (
        obj: PLObject,
        ydoc?: any,
        forceUpdate?: any
) => {
        const { children } = obj
        initConnect(obj, ydoc, forceUpdate)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(initConnectAll)
}

export const pubConnectAll = (obj: PLObject) => {
        const { children } = obj
        pubConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(pubConnectAll)
}

export const delConnectAll = (obj: PLObject) => {
        const { children } = obj
        delConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(delConnectAll)
}

export const subConnectAll = (obj: PLObject) => {
        const { children } = obj
        subConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(subConnectAll)
}
