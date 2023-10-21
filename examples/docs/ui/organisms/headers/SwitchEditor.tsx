import * as React from 'react'
import { Drop } from '../../atoms'
import { DropItems, HeaderButton, HeaderItem } from '../../molecules'
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
                        <HeaderItem onClick={() => onClick(type)} key={type}>
                                {Icon_ && <Icon_ />}
                                {Up(type)}
                        </HeaderItem>
                )
        }

        return (
                <Drop>
                        <HeaderButton>{Icon && <Icon />}</HeaderButton>
                        <DropItems items={editorItems}>{render}</DropItems>
                </Drop>
        )
}
