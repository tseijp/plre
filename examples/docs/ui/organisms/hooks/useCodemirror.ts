import { MutableRefObject, useEffect } from 'react'
import { event } from 'reev'
import { useCall, useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import type { EditorView } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { collectAll } from 'plre/utils'

export interface CodemirrorEvent {
        mount?(): void
        clean?(): void
        target?: HTMLElement
        extensions: any[]
        libs: any
        state?: EditorState
        view?: EditorView & any
        ref: MutableRefObject<HTMLElement>
}

export const codemirrorEvent = (doc = '') => {
        const mount = async () => {
                const [
                        { cpp },
                        { EditorState },
                        { EditorView, lineNumbers },
                        { githubDark },
                ] = await Promise.all([
                        import('@codemirror/lang-cpp'),
                        import('@codemirror/state'),
                        import('@codemirror/view'),
                        import('@uiw/codemirror-theme-github'),
                ])
                const parent = self.target
                const myTheme = EditorView.theme(theme, { dark: true })
                const extensions = [cpp(), lineNumbers(), githubDark, myTheme]
                const state = EditorState.create({ doc, extensions })
                const view = new EditorView({ state, parent })
                self.libs = {
                        cpp,
                        EditorState,
                        EditorView,
                        lineNumbers,
                        githubDark,
                }
                self.extensions = extensions
                self.state = state
                self.view = view
        }

        const clean = () => {}

        const ref = (el: HTMLElement) => {
                if (el) {
                        self.target = el
                        self.mount()
                } else self.clean()
        }

        const self = event<CodemirrorEvent>({
                mount,
                clean,
                ref,
        })
        return self
}

export const useCodemirror = () => {
        const { objectTree } = useCtx()
        const self = useOnce(() => codemirrorEvent(collectAll(objectTree)))
        const changeActive = useCall((obj) => {
                const { EditorState } = self.libs
                const doc = obj.shader
                const extensions = self.extensions
                const state = EditorState.create({ doc, extensions })
                self.view.setState(state)
                self.state = state
        })

        useEffect(() => {
                // @ts-ignore
                objectTree({ changeActive })
                // @ts-ignore
                return () => objectTree({ changeActive })
        }, [])
        return self
}

const theme = {
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
}
