import { addSuffix, attachParent, getLayerKey, isIgnoreProp } from './utils'
import { PLObject } from './types'
import { createObject } from '.'
import { deleteObject } from './control'

export const initConnect = (obj: PLObject) => {
        const { children, parent, memo } = obj
        const _key = getLayerKey(obj)

        if (memo._init) return console.warn(initWarn(obj))

        if (parent) {
                memo.ydoc = parent.memo.ydoc
                memo.compile = parent.memo.compile
        }

        if (!memo.ydoc) return console.warn(notYDOCWarn(obj))

        const ydoc = memo.ydoc
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
                        const ids = children.map((c) => c.id)
                        child = createObject(type as any)
                        child.id = addSuffix(ids, child.id)
                        children.push(child)
                        attachParent(obj)

                        // initialize when open page
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
        const { parent, memo } = obj
        const { ymap } = memo

        if (!ymap) return console.warn(notInitWarn(obj))
        if (memo._pub) return console.warn(notInitWarn(obj))

        const _key = getLayerKey(obj)
        if (parent) parent.memo.yarr.set(_key, obj.type)

        for (const key in obj) {
                const value = obj[key]
                if (isIgnoreProp(value, key)) continue
                ymap.set(key, value)
        }

        // Duplicate subscribe add delta with update of this publish
        // children.forEach((child) => {
        //         const key = getLayerKey(child)
        //         yarr.set(key, child.type)
        // })

        // debug
        if (!memo._pub) memo._pub = 0
        memo._pub++
        console.log('plre/conenct pub', { ...obj })
}

export const delConnect = (obj: PLObject) => {
        const { parent, memo } = obj
        const { ymap, yarr } = memo

        if (!ymap || !yarr) return console.warn(notInitWarn(obj))

        for (const key in obj) {
                if (isIgnoreProp(obj[key], key)) continue
                ymap.set(key, void 0)
        }

        yarr.forEach((key: string) => {
                if (yarr.get(key)) yarr.set(key, void 0)
        })

        const _key = getLayerKey(obj)

        if (parent) parent.memo.yarr.set(_key, void 0)

        memo.unobserveListener?.forEach((f: any) => f())

        // debug
        if (!memo._del) memo._del = 0
        memo._del++
        console.log('plre/conenct del', { ...obj })
}

export const subConnect = (obj: PLObject) => {
        const { memo, children, forceUpdate = () => {} } = obj
        const { ymap, yarr, compile } = memo

        if (!ymap || !yarr) return console.warn(notInitWarn(obj))
        if (memo._sub) return console.warn(subWarn(obj))

        const _yarr = (e: any) => {
                if (e.transaction.local) return

                // debug
                if (!memo._yarr) memo._yarr = 0
                memo._yarr++
                let isUpdated = false

                e.changes.keys.forEach((_: any, key: string) => {
                        const type = yarr.get(key)
                        // prettier-ignore
                        console.log(`plre/conenct sub _yarr { key: ${key}, type: ${type} } `, _)
                        if (type) {
                                // create object
                                const child = createObject(type)
                                const ids = children.map((c) => c.id)
                                child.id = addSuffix(ids, child.id)
                                children.push(child)
                                attachParent(obj)
                                initConnect(child)
                                subConnect(child)
                                isUpdated = true
                                return
                        }
                        // delete object
                        const child = children.find(
                                (c) => getLayerKey(c) === key
                        )
                        if (child) {
                                deleteObject(child)
                                isUpdated = true
                        }
                })

                if (isUpdated) compile()
        }

        const _ymap = (e: any) => {
                if (e.transaction.local) return

                if (!memo.ymap) memo._ymap = 0
                memo._ymap++

                let isUpdated = false

                e.changes.keys.forEach((_: any, key: string) => {
                        const value = ymap.get(key)
                        // prettier-ignore
                        console.log(`plre/conenct sub _ymap { key: ${key}, value: ${value} }`)
                        if (isIgnoreProp(value, key)) return
                        if (obj[key] === value) return
                        isUpdated = true
                        obj[key] = value
                })

                if (isUpdated) forceUpdate()
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

export const initConnectAll = (obj: PLObject) => {
        const { children } = obj
        initConnect(obj)
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

const notYDOCWarn = (obj: PLObject) => {
        return `plre/connect subConnect Warn: ${obj.id} is not YDOC`
}

const notInitWarn = (obj: PLObject) => {
        return `plre/connect pubConnect Warn: ${obj.id} is not initialized`
}

const initWarn = (obj: PLObject) => {
        return `plre/connect subConnect Warn: ${obj.id} is already initialized`
}

const subWarn = (obj: PLObject) => {
        return `plre/connect subConnect Warn: ${obj.id} is already subscribed`
}
