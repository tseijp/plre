import { event } from 'reev'
import { createGL } from 'glre'
import { fs, vs } from './shader'
import { EventState } from 'reev'
import { PL, PLObject, ObjectTypes, EditorType, EditorState } from './types'

const colorA = [192 / 255, 78 / 255, 255 / 255]
const colorB = [112 / 255, 200 / 255, 228 / 255]
const colorC = [255 / 255, 224 / 255, 178 / 255]
const floorColor = [58 / 255, 58 / 255, 58 / 255]

export const createObject = (
        type: ObjectTypes,
        props: Partial<PLObject> = {},
        _children: PLObject | PLObject[] = []
) => {
        const {
                // type = _type
                id = type,
                children = _children,
                position = [0, 0, 0],
                rotation = [0, 0, 0],
                scale = [1, 1, 1],
                color = [1, 1, 1],
                index = 0,
                ...other
        } = props

        const self = event({
                type,
                id,
                position,
                rotation,
                scale,
                color,
                index,
                children: Array.isArray(children) ? children : [children],
                ...other,
        })
        return self as EventState<PLObject>
}

export const createEditor = (
        type: EditorType,
        props: Partial<EditorState> = {},
        _children: EditorState[] = []
) => {
        const {
                // type = _type
                id = type,
                children = _children,
                top = false,
                row = false,
                memo = {},
                ...other
        } = props

        const self = event({
                type,
                children,
                top,
                row,
                memo,
                ...other,
        }) as EventState<EditorState>

        return self
}

export const createPL = (props: Partial<PL> = {}) => {
        const mount = () => {
                self(props)
                self.uniform({
                        colorA,
                        colorB,
                        colorC,
                        floorColor,
                        lookAt: [0, 0, 0],
                })
        }

        const clean = () => {
                self(props)
        }

        const self = createGL({
                vs,
                fs,
                mount,
                clean,
        }) as PL

        return self
}

export const pl = createPL()

export default pl
