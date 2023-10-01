import { attachParent, getLayerKey, isIgnoreProp } from './utils'
import { PLObject } from './types'
import { createObject } from '.'

export const init = (obj: PLObject) => {
        const { memo } = obj
        const _key = getLayerKey(obj)
        const { ydoc } = memo
        const ymap = (memo.ymap = ydoc.getMap(_key))
        const yarr = (memo.yarr = ydoc.getArray(_key + '_'))

        for (const key in obj) {
                if (isIgnoreProp(obj[key], key)) continue
                const value = ymap.get(key)
                if (value !== void 0) obj[key] = value
        }

        yarr.forEach((type: string) => {
                if (type) {
                        const child = createObject(type as any)
                        obj.children.push(child)
                        attachParent(obj)
                        init(child)
                        sub(child)
                } else {
                        // deleteObject(child)
                        // unobserve(obj)
                }
        })
}

export const pub = (obj: PLObject) => {
        const { children, memo } = obj
        const { ymap, yarr } = memo

        for (const key in obj) {
                if (isIgnoreProp(obj[key], key)) continue
                ymap.set(key, obj[key])
        }

        children.forEach((child) => {
                const __key = getLayerKey(child)
                yarr.set(__key, child.type)
        })
}

export const del = (obj: PLObject) => {
        const { memo } = obj
        const { ymap, yarr } = memo
        for (const key in obj) {
                if (isIgnoreProp(obj[key], key)) continue
                ymap.set(key, void 0)
        }

        yarr.forEach((key: string) => {
                yarr.set(key, undefined)
        })

        obj.memo.unobserveListener.forEach((f = () => {}) => f())
}

export const sub = (obj: PLObject) => {
        const { memo, children } = obj
        const { ymap, yarr } = memo

        const _yarr = (e: any) => {
                if (e.transaction.local) return
                e.changes.keys.forEach((_: any, key: string) => {
                        const type = yarr.get(key)
                        if (type) {
                                const child = createObject(type)
                                obj.children.push(child)
                                attachParent(obj)
                                init(child)
                                sub(child)
                                return
                        }
                        const child = children.find((c) => c.key === key)
                        delAll(child)
                })
        }

        const _ymap = (e: any) => {
                if (e.transaction.local) return
                e.changes.keys.forEach((value: any, key: string) => {
                        if (isIgnoreProp(value, key)) return
                        obj[key] = ymap.get(key)
                        // if (obj.forceUpdate) obj.forceUpdate()
                })
        }
        yarr.observe(_yarr)
        ymap.observe(_ymap)
        if (!obj.memo.unobserveListener) obj.memo.unobserveListener = new Set()
        obj.memo.unobserveListener.add(() => yarr.unobserve(_yarr))
        obj.memo.unobserveListener.add(() => ymap.unobserve(_ymap))
}

export const initAll = (obj: PLObject) => {
        init(obj)
        obj.children.forEach(initAll)
}

export const pubAll = (obj: PLObject) => {
        pub(obj)
        obj.children.forEach(pub)
}

export const delAll = (obj: PLObject) => {
        del(obj)
        obj.children.forEach(del)
}

export const subAll = (obj: PLObject) => {
        sub(obj)
        obj.children.forEach(sub)
}
