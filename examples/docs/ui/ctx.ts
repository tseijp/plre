import { createContext, useContext } from 'react'
import type { WebrtcState } from './templates/hooks'
import type { EditorState, PLObject } from 'plre/types'

export interface LayoutState {
        objectTree: PLObject
        editorTree: EditorState
        webrtcTree: WebrtcState
}

export const LayoutContext = createContext(null as unknown as LayoutState)

export const LayoutProvider = LayoutContext.Provider

export const LayoutConsumer = LayoutContext.Consumer

export const useLayout = () => useContext(LayoutContext)
