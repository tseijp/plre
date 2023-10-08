import * as React from 'react'
import { Drop } from '../../atoms'
import { DropItems } from '../../molecules'
import { Up } from '../../utils'
import { WINDOW_ICONS } from '../../atoms'
import type { EditorType } from 'plre/types'

export interface SwitchEditorProps {
        type: EditorType
        onClick(type: EditorType): void
}

const editorItems = ['viewport', 'viewlayer', 'timeline', 'properties']

export const SwitchEditor = (props: SwitchEditorProps) => {
        const { type, onClick } = props

        const Icon = WINDOW_ICONS[type]

        const render = (type: EditorType) => {
                const Icon_ = WINDOW_ICONS[type]
                return (
                        <div
                                onClick={() => onClick(type)}
                                key={type}
                                style={{
                                        gap: '0.5rem',
                                        width: '100%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                }}
                        >
                                {Icon_ && <Icon_ />}
                                {Up(type)}
                        </div>
                )
        }

        return (
                <Drop marginTop="2px">
                        <span
                                style={{
                                        height: 18,
                                        padding: '0 0.25rem',
                                        textAlign: 'center',
                                }}
                        >
                                {Icon && <Icon />}
                        </span>
                        <DropItems items={editorItems}>{render}</DropItems>
                </Drop>
        )
}
