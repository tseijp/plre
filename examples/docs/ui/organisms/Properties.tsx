import * as React from 'react'
import pl from 'plre'
import { cpp } from '@codemirror/lang-cpp'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers } from '@codemirror/view'
import { Flex } from '../atoms/Flex'
import { useRef, useEffect } from 'react'
import { githubDark } from '@uiw/codemirror-theme-github'

interface PropertiesState {
        parent: HTMLDivElement | null
        state: EditorState
        view: EditorView
}

export const Properties = () => {
        const ref = useRef<HTMLDivElement | null>(null)
        const _ = useRef<PropertiesState>({} as PropertiesState).current

        useEffect(() => {
                if (!ref.current) return
                const doc = pl.fs
                const parent = ref.current
                const extensions = [cpp(), lineNumbers(), githubDark, myTheme]
                const state = EditorState.create({ doc, extensions })
                _.parent = parent
                _.state = state
                _.view = new EditorView({ state, parent })
        }, [])

        return (
                <Flex background="#303030">
                        <Flex height="25px"></Flex>
                        <Flex ref={ref} />
                </Flex>
        )
}

const myTheme = EditorView.theme(
        {
                '&': {
                        width: '100%',
                        height: '100%',
                        color: '#E5E5E5',
                        backgroundColor: '#303030',
                },
                '.cm-content': {
                        caretColor: '#fff',
                },
                '&.cm-focused .cm-selectionBackground, ::selection': {
                        backgroundColor: '#3A3A3A',
                },
                '.cm-gutters': {
                        backgroundColor: '#1D1D1D',
                        color: '#A8A8A8',
                        border: 'none',
                },
        },
        { dark: true }
)
