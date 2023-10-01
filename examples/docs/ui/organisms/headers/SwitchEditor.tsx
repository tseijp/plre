import * as React from 'react'
import { Drop } from '../../atoms'
import { DropItems } from '../../molecules'
import { Up } from '../../utils'
import type { EditorType } from 'plre/types'

export interface SwitchEditorProps {
        type: string
        onClick(type: EditorType): void
}

const editorItems = ['viewport', 'viewlayer', 'timeline', 'properties']

export const SwitchEditor = (props: SwitchEditorProps) => {
        const { type, onClick } = props
        const render = (type: EditorType) => (
                <div onClick={() => onClick(type)}>{Up(type)}</div>
        )

        return (
                <Drop marginTop="2px">
                        <span
                                style={{
                                        width: 18,
                                        height: 18,
                                        textAlign: 'center',
                                }}
                        >
                                {type}
                        </span>
                        <DropItems items={editorItems}>{render}</DropItems>
                </Drop>
        )
}
