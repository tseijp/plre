import { createContext, useContext } from 'react'
import type { WebrtcState } from './templates/hooks'
import type { EditorState, PLObject } from 'plre/types'

export interface CtxState {
        objectTree: PLObject
        editorTree: EditorState
        webrtcTree: WebrtcState
        cacheItems: CacheItem[]
}

export const CtxContext = createContext(null as unknown as CtxState)

export const CtxProvider = CtxContext.Provider

export const CtxConsumer = CtxContext.Consumer

export const useCtx = () => useContext(CtxContext)
