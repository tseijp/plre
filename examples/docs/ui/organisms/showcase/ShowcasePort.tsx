import * as React from 'react'
import { CtxProvider, CtxState } from '../../ctx'
import { usePLImpl2 } from './hooks'
import { ObjectState } from 'plre/types'

export interface ShowcasePort {
        objectTree: ObjectState
}

export const ShowcasePort = (props: ShowcasePort) => {
        const { objectTree } = props
        const self = usePLImpl2(objectTree)
        return (
                <CtxProvider value={{ objectTree } as CtxState}>
                        <div
                                style={{
                                        width: '100%',
                                        height: '256px',
                                }}
                        >
                                <canvas
                                        ref={self.ref}
                                        style={{
                                                width: '100%',
                                                height: '256px',
                                                background: '#3A3A3A',
                                        }}
                                />
                        </div>
                </CtxProvider>
        )
}

export const ShowcasePortDummy = () => {
        return (
                <div
                        style={{
                                width: '100%',
                                height: '256px',
                                background: '#3A3A3A',
                        }}
                />
        )
}
