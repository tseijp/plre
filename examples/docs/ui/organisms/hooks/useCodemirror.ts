import { PLObject } from 'plre/types'
import { MutableRefObject, useEffect } from 'react'
import { event } from 'reev'
import { useCall, useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import type { EditorView } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { getActiveObjects } from 'plre/utils'

export interface CodemirrorEvent {
        mount?(): void
        clean?(): void
        target?: HTMLElement
        extensions: any[]
        libs: any
        changeEditor(v: any): void
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
                const listenner = EditorView.updateListener.of((v) => {
                        self.changeEditor(v)
                })
                const extensions = [
                        cpp(),
                        lineNumbers(),
                        githubDark,
                        myTheme,
                        listenner,
                ]
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
                changeEditor: () => {},
                mount,
                clean,
                ref,
        })
        return self
}

interface UseCodemirrorCache {
        obj?: PLObject
}

export const useCodemirror = () => {
        const { editorTree, objectTree } = useCtx()
        const cache = useOnce<UseCodemirrorCache>(() => ({
                obj: getActiveObjects(objectTree)[0],
        }))
        const self = useOnce(() => codemirrorEvent(cache.obj?.shader))

        const changeActive = useCall((obj) => {
                // cache to save changed code
                cache.obj = obj

                // reset codemirror
                const { EditorState } = self.libs
                const doc = obj?.shader || ''
                const extensions = self.extensions
                const state = EditorState.create({ doc, extensions })
                self.view.setState(state)
                self.state = state
        })

        const changeEditor = useCall((v: any) => {
                if (!v.docChanged || !cache.obj) return
                const code = v.state.doc.toString()
                cache.obj.shader = code
                if (!cache.obj.isEditted) cache.obj.forceUpdate()
                cache.obj.isEditted = true
        })

        useEffect(() => {
                // @ts-ignore
                editorTree({ changeActive })
                self({ changeEditor })
                return () => {
                        // @ts-ignore
                        editorTree({ changeActive })
                        self({ changeEditor })
                }
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
