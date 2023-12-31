import { createContext, useContext } from 'react'
import type { WebrtcState } from './templates/hooks'
import type { EditorState, ObjectState } from 'plre/types'
import type { CacheState } from 'plre/cache'

export interface CtxState {
        objectTree: ObjectState
        editorTree: EditorState
        webrtcTree: WebrtcState
        storage: CacheState
        isReady: boolean // webrtcTree.isReady && storage.isReady
}

export const CtxContext = createContext(null as unknown as CtxState)

export const CtxProvider = CtxContext.Provider

export const CtxConsumer = CtxContext.Consumer

export const useCtx = () => useContext(CtxContext)
