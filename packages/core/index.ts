import { attachParent } from './utils'
import { event } from 'reev'
import { createGL } from 'glre'
import { fs, vs } from './shader'
import { EventState } from 'reev'
import { PL, PLObject, ObjectTypes, EditorType, EditorState } from './types'

let currentIndex = 1

export const createObject = (
        type: ObjectTypes,
        props: Partial<PLObject> = {},
        _children: PLObject | PLObject[] = []
) => {
        const {
                // type = _type
                id = type,
                key = type,
                children: c = _children,
                position = [0, 0, 0],
                rotation = [0, 0, 0],
                scale = [1, 1, 1],
                color = [1, 1, 1],
                shader = '',
                index = currentIndex++,
                memo = {},
                ...other
        } = props

        const children = Array.isArray(c) ? c : [c]

        const self = event({
                type,
                id,
                key,
                position,
                rotation,
                scale,
                color,
                children,
                shader: shader.trim(),
                index,
                memo,
                ...other,
        }) as EventState<PLObject>

        attachParent(self)

        return self
}

export const createEditor = (
        type: EditorType,
        props: Partial<EditorState> = {},
        _children: EditorState | EditorState[] = []
) => {
        const {
                // type = _type
                id = type,
                children: c = _children,
                top = false,
                row = false,
                memo = {},
                ...other
        } = props

        const children = Array.isArray(c) ? c : [c]

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
