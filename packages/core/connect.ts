import {
        addSuffix,
        attachParent,
        getLayerKey,
        isIgnoreProp,
        isTransformKey,
        setTransformFromKey,
} from './utils'
import { PLObject } from './types'
import { createObject } from '.'
import { deleteObject } from './control'

const TIMEOUT_MS = 1000

export const initConnect = (obj: PLObject) => {
        const { children, parent, memo } = obj
        const _key = getLayerKey(obj)

        // if (memo._init) return console.warn(initWarn(obj))

        if (parent) {
                memo.ydoc = parent.memo.ydoc
                memo.updateUniform = parent.memo.updateUniform
                memo.compileShader = parent.memo.compileShader
                memo.forceUpdateRoot = parent.memo.forceUpdateRoot
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
                        const ids = children.map((c) => c.id) // get ids before attach to parent
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

        console.log('[plre/conenct] init', { obj: { ...obj } })
}

export const pubConnect = (obj: PLObject) => {
        const { parent, memo } = obj
        const { ymap } = memo

        if (!ymap) return console.warn(notInitWarn(obj, 'pubConnect'))

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
        console.log('[plre/conenct] pub', { obj: { ...obj } })
}

export const delConnect = (obj: PLObject) => {
        const { parent, memo } = obj
        const { ymap, yarr } = memo
        const _key = getLayerKey(obj)

        if (!ymap || !yarr) return console.warn(notInitWarn(obj, 'delConnect'))

        // top object does not delete connections
        if (parent) {
                for (const key in obj) {
                        if (isIgnoreProp(obj[key], key)) continue
                        ymap.set(key, void 0)
                }
                parent.memo.yarr.set(_key, void 0)
                memo.unobserveListener?.forEach((f: any) => f())
        }

        yarr.forEach((key: string) => {
                if (yarr.get(key)) yarr.set(key, void 0)
        })

        // debug
        if (!memo._del) memo._del = 0
        memo._del++
        console.log('[plre/conenct] del', { obj: { ...obj } })
}

export const subConnect = (obj: PLObject) => {
        const { memo, children } = obj
        const { ymap, yarr, forceUpdateRoot, compileShader, updateUniform } =
                memo

        if (!ymap || !yarr) return console.warn(notInitWarn(obj, 'subConnect'))

        const _forceUpdate = () => {
                const id = setTimeout(forceUpdateRoot, TIMEOUT_MS)
                memo._forceUpdateRoot?.()
                memo._forceUpdateRoot = () => window.clearTimeout(id)
        }

        const _compileShader = () => {
                const id = setTimeout(compileShader, TIMEOUT_MS)
                memo._compileShader?.()
                memo._compileShader = () => window.clearTimeout(id)
        }

        /**
         * subscribe children
         */
        const _yarr = (e: any) => {
                if (e.transaction.local) return

                // debug
                if (!memo._yarr) memo._yarr = 0
                memo._yarr++

                let isUpdated = false
                let isCompile = false

                console.log(`[plre/conenct] sub yarr forEach START`)
                e.changes.keys.forEach((_: any, key: string) => {
                        const type = yarr.get(key)
                        // prettier-ignore
                        console.log(`[plre/conenct] sub _yarr \t { key: ${key}, type: ${type} } `, _)
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
                                isCompile = true
                                return
                        }

                        // delete object
                        const child = children.find((c) => {
                                return getLayerKey(c) === key
                        })

                        if (child) {
                                deleteObject(child)
                                isUpdated = true
                                isCompile = true
                        }
                })
                if (isUpdated) _forceUpdate()
                if (isCompile) _compileShader()
        }

        /**
         * subscribe uniform and glsl code
         */
        const _ymap = (e: any) => {
                if (e.transaction.local) return

                if (!memo.ymap) memo._ymap = 0
                memo._ymap++

                let isUpdated = false
                let isCompile = false

                console.log(`[plre/conenct] sub ymap forEach START`)
                e.changes.keys.forEach((_: any, key: string) => {
                        const value = ymap.get(key)
                        // prettier-ignore
                        console.log(`[plre/conenct] sub _ymap \t { key: ${key}, value: ${value} }`)
                        if (isIgnoreProp(value, key)) return

                        // update transform
                        if (isTransformKey(key)) {
                                setTransformFromKey(obj, key, value)
                                updateUniform(obj) // Update WebGL Uniform events
                                return
                        }

                        if (obj[key] === value) return

                        // update shader
                        if (key === 'shader') isCompile = true

                        isUpdated = true
                        obj[key] = value
                })
                if (isUpdated) _forceUpdate()
                if (isCompile) _compileShader()
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

export const pubShader = (obj: PLObject) => {
        const { isEditted, memo, forceUpdate } = obj
        const { ymap } = memo

        if (!isEditted) return
        if (!ymap) return console.warn(notInitWarn(obj, 'pubShader'))

        obj.isEditted = false
        forceUpdate()
        ymap.set('shader', obj.shader)
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

export const pubShaderAll = (obj: PLObject) => {
        const { children } = obj
        pubShader(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(pubShaderAll)
}

const notYDOCWarn = (obj: PLObject) => {
        return `[plre/connect] initConnect Warn: ${obj.id} is not have YDOC`
}

const notInitWarn = (obj: PLObject, key = '') => {
        return `[plre/connect] ${key} Warn: ${obj.id} is not initialized`
}
