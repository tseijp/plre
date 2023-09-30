import * as ShaderChunk from './shader'
import { PLObject } from './types'

export const isMaterial = (obj: PLObject) => obj?.type === 'Material'

export const isCollection = (obj: PLObject) =>
        !isMaterial(obj) && obj?.type?.length === 1

export const isObject = (obj: PLObject) =>
        !isMaterial(obj) && obj?.type?.length > 1

export const attachParent = (self: PLObject) => {
        const ids = [] as string[]
        self.children.forEach((child) => {
                child.parent = self
                child.key = addSuffix(ids, child.key)
                ids.push(child.key)
        })
        return self
}

export const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm

export const resolveIncludes = (str = '') => {
        return str.replace(includePattern, includeReplacer)
}

export const shaderChunkMap = new Map([])

export const includeReplacer = (_ = '', include = '') => {
        let str = ShaderChunk[include]
        if (!str) str = shaderChunkMap.get(include)
        return resolveIncludes(str)
}

export const addSuffix = (ids = [''], id = '') => {
        let suffix = ''
        let index = 1
        const match = id.match(/^(_*)\.(\d{3})$/)
        if (match) id = match[1]
        const some = (name = '') => ids.some((_id) => _id === name)
        while (some(id + suffix)) {
                suffix = '_' + String(index).padStart(3, '0')
                index++
        }
        return id + suffix
}

export const getLayerKey = (obj: PLObject) => {
        if (!obj.parent) return obj.key
        return getLayerKey(obj.parent) + '_' + obj.key
}

// export const withDirective = (shader = '', key = '') => {
//         const header = `#ifndef ${key}\n#define ${key}\n`
//         const footer = `\n#endif\n`
//         return header + shader + footer
// }
