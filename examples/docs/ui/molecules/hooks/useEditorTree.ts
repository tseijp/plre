import { useState } from 'react'
import { event } from 'reev'
import { useForceUpdate } from '../../atoms'
import type { EventState } from 'reev/types'

export type EditorType =
        | 'viewport'
        | 'timeline'
        | 'viewlayer'
        | 'properties'
        | 'I'

export interface EditorState {
        type: EditorType
        rate: [number, number]
        top: boolean
        row: boolean
        update?: () => void
        children: EditorState[]
}

export type EditorEvent = EventState<EditorState>

export const createEditor = (
        type: EditorType,
        props: Partial<EditorState> = {},
        _children: EditorState[] = []
) => {
        const {
                children = _children,
                top = false,
                row = false,
                ...other
        } = props

        const self = event({
                children,
                type,
                top,
                row,
                ...other,
        }) as EditorEvent

        return self
}

export const createEditorTree = (update = () => {}) => {
        const viewport = createEditor('viewport')
        const timeline = createEditor('timeline')
        const viewlayer = createEditor('viewlayer')
        const properties = createEditor('properties')
        const left = createEditor('I', { rate: [0.92, 0.08] }, [
                viewport,
                timeline,
        ])
        const right = createEditor('I', { rate: [0.33, 0.67] }, [
                viewlayer,
                properties,
        ])
        const top = createEditor(
                'I',
                { rate: [0.83, 0.17], row: true, update },
                [left, right]
        )
        return top
}

export const useEditorTree = () => {
        const update = useForceUpdate()
        const [self] = useState(() => createEditorTree(update))
        return self
}
