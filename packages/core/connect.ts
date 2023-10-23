import {
        addSuffix,
        attachParent,
        getLayerKey,
        isIgnoreProp,
        isTransformKey,
        setTransformFromKey,
} from './utils'
import { ObjectState } from './types'
import { createObject } from '.'
import { deleteObject } from './control'

/**
 * utils
 */
const TIMEOUT_MS = 1000

const DELETED = 'DELETED'

const notYDOCWarn = (obj: ObjectState) => {
        return `[plre/connect] initConnect Warn: ${obj.id} is not have YDOC`
}

const notInitWarn = (obj: ObjectState, key = '') => {
        return `[plre/connect] ${key} Warn: ${obj.id} is not initialized`
}

/**
 * Set a value in own ymap and register self in the parent's yarr
 */
export const pubConnect = (obj: ObjectState) => {
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

/**
 *
 * Also, cleanup subscriptions
 */
export const delConnect = (obj: ObjectState) => {
        const { parent, memo } = obj
        const { ymap, yarr } = memo
        const _key = getLayerKey(obj)

        if (!ymap || !yarr) return console.warn(notInitWarn(obj, 'delConnect'))

        // top object does not delete connections
        if (parent) {
                for (const key in obj) {
                        if (isIgnoreProp(obj[key], key)) continue
                        ymap.set(key, DELETED) // !!! not undefined
                }
                parent.memo.yarr.set(_key, DELETED) // !!! not undefined
                memo.unobserveListener?.forEach((f: any) => f())
        }

        yarr.forEach((key: string) => {
                if (yarr.get(key)) yarr.set(key, DELETED) // !!! not undefined
        })

        // debug
        if (!memo._del) memo._del = 0
        memo._del++
        console.log('[plre/conenct] del', { obj: { ...obj } })
}

/**
 * Attach ydoc, ymap, yarr and control the object from changes in ymap and yarr
 */
export const initConnect = (obj: ObjectState) => {
        const { children, parent, memo } = obj
        const _key = getLayerKey(obj)

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
                if (isIgnoreProp(value, key)) continue
                obj[key] = value
        }

        for (const key of yarr.keys()) {
                const type = yarr.get(key)
                /**
                 * Some object disappears when type is duplicated if check isExisted with type.
                 */
                // let child = children.find((c) => c.type === type)
                let child = children.find((c) => getLayerKey(c) === key)
                const isExisted = !!child
                const isDeleted = type === DELETED

                /**
                 *                  | isExisted
                 *                  | true   | false
                 *  :-------------- | :----- | :------
                 *  isDeleted true  | delete | x
                 *            false | x      | create
                 */
                if (!isExisted && !isDeleted) {
                        const ids = children.map((c) => c.id) // get ids before attach to parent
                        child = createObject(type as any)
                        child.id = addSuffix(ids, child.id)

                        children.push(child)
                        attachParent(obj)

                        // initialize when open page
                        initConnect(child)
                        subConnect(child)
                }
                if (isExisted && isDeleted) deleteObject(child!)
        }

        // debug
        if (!memo._init) memo._init = 0
        memo._init++

        console.log('[plre/conenct] init', { obj: { ...obj } })
}

export const subConnect = (obj: ObjectState) => {
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
                        if (type !== DELETED) {
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

export const pubShader = (obj: ObjectState) => {
        const { isEditted, memo, forceUpdate } = obj
        const { ymap } = memo

        if (!isEditted) return
        if (!ymap) return console.warn(notInitWarn(obj, 'pubShader'))

        obj.isEditted = false
        forceUpdate()
        ymap.set('shader', obj.shader)
}

export const pubConnectAll = (obj: ObjectState) => {
        const { children } = obj
        pubConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(pubConnectAll)
}

export const delConnectAll = (obj: ObjectState) => {
        const { children } = obj
        delConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(delConnectAll)
}

export const initConnectAll = (obj: ObjectState) => {
        const { children } = obj
        initConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(initConnectAll)
}

export const subConnectAll = (obj: ObjectState) => {
        const { children } = obj
        subConnect(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(subConnectAll)
}

export const pubShaderAll = (obj: ObjectState) => {
        const { children } = obj
        pubShader(obj)
        if (!Array.isArray(children) || children.length === 0) return
        children.forEach(pubShaderAll)
}

export const delConnectDiff = (obj: ObjectState, targetParent: any) => {
        const { children } = obj
        // for objectTree top
        if (!obj.parent)
                return children.forEach((child) => {
                        delConnectDiff(child, targetParent)
                })

        const target = targetParent.children?.some(
                ({ type }) => type === obj.type
        )
        if (!target) {
                delConnectAll(obj)
                return
        }
        if (!Array.isArray(children) || children.length === 0) return

        children.forEach((child) => {
                delConnectDiff(child, target)
        })
}
