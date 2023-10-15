import { PLObject } from './types'
import * as ShaderChunk from './shader'
import {
        getLayerKey,
        isCollection,
        isMaterial,
        isObject,
        resolveIncludes,
        shaderChunkMap,
} from './utils'

export const withDirective = (shader = '', key = '') => {
        const header = `#ifndef ${key}\n#define ${key}\n`
        const footer = `\n#endif\n`
        return header + shader + footer
}

const NEW_LINE = '\n        '

export const compileCollection = (obj: PLObject) => {
        const { parent, children, type } = obj
        const _key = parent ? getLayerKey(obj) : 'map'
        const _mat = _key + '_M'
        const isU = type === 'U'

        let ret = `uniform mat4 ${_mat};\n`
        ret += `vec2 ${_key}(vec3 pos) {` + NEW_LINE
        ret += `TRANSFORM(${_mat}, pos);` + NEW_LINE
        ret += `vec2 res = ${isU ? 'MAX' : 'MIN'};`
        children.forEach((child) => {
                let ind = compileFloat(child.index)
                const isI = child.type.length === 1
                const key = getLayerKey(child)
                const add = isI ? `${key}(pos)` : `vec2(${key}(pos), ${ind})`
                ret += NEW_LINE + `res = op${type}(res, ${add});`
        })
        ret += NEW_LINE + 'return res;'
        ret += '\n}'
        // ret = withDirective(ret, _key)
        return ret
}

export const compileObject = (obj: PLObject) => {
        let ret = obj.shader.trim()
        // ret = withDirective(ret, _key)
        return ret
}

export const compileMaterial = (obj: PLObject) => {
        let ret = obj.shader.trim()
        // const _key = getLayerKey(obj)
        // ret = withDirective(ret, _key)
        return ret
}

export const compileFloat = (num: number) => {
        let ret = num + ''
        if (!ret.includes('.')) ret += '.'
        return ret
}

export const complieVector = (arr: number[]) => {
        if (arr.length <= 1 || 4 < arr.length) throw Error()
        return `vec${arr.length}(` + arr.map(compileFloat) + ')'
}

export const compile = (obj: PLObject) => {
        if (isMaterial(obj.type)) return compileMaterial(obj)
        if (isCollection(obj.type)) return (obj.shader = compileCollection(obj))
        return compileObject(obj)
}

const getMaterial = (obj: PLObject) => {
        return obj.children.find((child) => child.type === 'Material')
}

export const collectAll = (obj: PLObject) => {
        const { children, memo: _ } = obj
        console.log(_)
        // obj.shader = compile(obj)
        let min = compileFloat(obj.index - 0.01)
        let max = compileFloat(obj.index + 0.01)
        const _if = `if (${min} < res.y && res.y < ${max})`

        // initialize
        _.renderAll = ''
        _.geometryAll = ''
        _.materialAll = ''
        _.collectionAll = ''

        const mat = getMaterial(obj)

        if (mat) {
                const _key = getLayerKey(mat)
                _.renderAll = `${_if} col = ${_key}(pos, nor);`
                _.renderAll += NEW_LINE
        } else if (obj.color?.length === 3) {
                const col = complieVector(obj.color)
                _.renderAll = `${_if} col = ${col};`
                _.renderAll += NEW_LINE
        }

        if (obj.children) {
                children.forEach((child) => {
                        collectAll(child)
                        _.geometryAll += child.memo.geometryAll
                        _.materialAll += child.memo.materialAll
                        _.renderAll += child.memo.renderAll
                })
        }

        if (isMaterial(obj.type)) _.materialAll += compileMaterial(obj) + '\n\n'
        else if (isObject(obj.type))
                _.geometryAll += compileObject(obj) + '\n\n'
        else if (isCollection(obj.type))
                _.geometryAll += compileCollection(obj) + '\n\n'

        if (!obj.parent) {
                shaderChunkMap.set('PLRE_GEOMETRY', _.geometryAll)
                shaderChunkMap.set('PLRE_MATERIAL', _.materialAll)
                shaderChunkMap.set('PLRE_COLLECTION', _.collectionAll)
                shaderChunkMap.set('PLRE_RENDER', renderShader(_.renderAll))
                return (_.shaderAll = resolveIncludes(ShaderChunk.fs))
        }

        return ''
}

const renderShader = (rebderAll = '') =>
        /* CPP */ `
vec3 render(vec3 ro, vec3 rd) {
        vec2 res = raymarch(ro, rd);

        if (res.y < 0.) return floorColor;

        vec3 pos = ro + res.x * rd;
        vec3 nor = normal(pos);
        vec3 col = vec3(2.);
        ${rebderAll}return col;
}
`.trim()
