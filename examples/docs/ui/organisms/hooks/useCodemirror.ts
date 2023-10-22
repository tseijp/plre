import { ObjectState } from 'plre/types'
import { MutableRefObject, useEffect } from 'react'
import { event } from 'reev'
import { useCall, useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import type { EditorView } from '@codemirror/view'
import type { EditorState } from '@codemirror/state'
import { getActiveObjects } from 'plre/utils'

export interface CodemirrorEvent {
        target?: HTMLElement
        state?: EditorState
        view?: EditorView & any
        ref: MutableRefObject<HTMLElement>
        extensions: any[]
        isMounted: boolean
        shader: string
        libs: any
        changeEditor(v: any): void
        mount?(): void
        clean?(): void
}
// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const codemirrorEvent = (shader = '') => {
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
                // dynamic import load may take a long time: Issue #7
                // await sleep(5000) // for edge case test
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
                const doc = self.shader || shader
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
                self.isMounted = true
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
                isMounted: false,
                extensions: [],
                libs: {},
                shader,
        })
        return self
}

interface UseCodemirrorCache {
        obj?: ObjectState
}

export const useCodemirror = () => {
        const { editorTree, objectTree, storage } = useCtx()
        const _ = useOnce<UseCodemirrorCache>(() => ({}))

        const self = useOnce(() => codemirrorEvent(_.obj?.shader))

        // change code when user click other object
        const changeActive = useCall((next) => {
                if (!next) next = getActiveObjects(objectTree)[0]

                // dynamic import may take a long time: Issue #7
                if (!self.isMounted) {
                        if (next?.shader) self.shader = next?.shader
                        return
                }

                if (!next) next = getActiveObjects(objectTree)[0]

                // cache to save changed code
                _.obj = next

                // reset codemirror
                const { EditorState } = self.libs
                const doc = next?.shader || ''
                const extensions = self.extensions
                const state = EditorState.create({ doc, extensions })
                self.view.setState(state)
                self.state = state
                self.shader = doc
        })

        // run if user change editor code
        const changeEditor = useCall((v: any) => {
                if (!v.docChanged || !_.obj) return
                const code = v.state.doc.toString()
                _.obj.shader = code
                if (!_.obj.isEditted) _.obj.forceUpdate?.()
                _.obj.isEditted = true

                // Cache only own changes in localStorage
                storage.isCacheable = true
        })

        // update editor code if subscribe object change
        const compileShader = useCall(() => {
                if (!_.obj) return
                if (_.obj.isEditted) return // ignore if editing is in progress or own compile.
                if (_.obj.shader === self.shader) return
                changeActive(_.obj)
        })

        useEffect(() => {
                // @ts-ignore
                editorTree({ changeActive, compileShader })
                self({ changeEditor })
                return () => {
                        // @ts-ignore
                        editorTree({ changeActive, compileShader })
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
