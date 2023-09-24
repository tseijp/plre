import React from 'react'
import { Flex, useForceUpdate, useOnce } from '../atoms'
import { useCtx } from '../ctx'
import { useUserCursor } from './hooks/useUserCursor'

const style = {
        display: 'inline-block',
        width: 10,
        height: 10,
        color: 'white',
        borderRadius: 9999,
        backgroundColor: 'white',
} as React.CSSProperties

export interface CursorProps {
        userId: string
}

export const Cursor = (props: CursorProps) => {
        const { userId } = props
        const { ref, username } = useUserCursor(userId)

        return (
                <div ref={ref} style={{ position: 'absolute', zIndex: 1000 }}>
                        <span style={style}></span>
                        <span>{' ' + username}</span>
                        <span>{' ' + userId}</span>
                </div>
        )
}

export const UserCursors = () => {
        const forceUpdate = useForceUpdate()
        const { webrtcTree } = useCtx()
        useOnce(() => {
                // @ts-ignore
                webrtcTree('updateUsers', forceUpdate)
                return true
        })
        console.log('RERENDER YSERCURSOR')
        return webrtcTree._users.map((key) => <Cursor key={key} userId={key} />)
}
