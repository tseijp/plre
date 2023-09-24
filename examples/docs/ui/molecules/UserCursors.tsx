import React, { useRef, useState } from 'react'
import { useCtx } from '../ctx'
import { useUserObserve } from './hooks'
import { useForceUpdate, useOnce } from '../atoms'
import { gsap } from 'gsap'

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
        // const { ref, username } = useUserObserve(userId)
        const ref = useRef()
        const [username, set] = useState('anonymous')

        const user = useUserObserve(userId, {
                onUpdate(key) {
                        const value = user.get(key)
                        if (key === 'username') set(value)
                        const el = ref.current
                        if (!el) return
                        if (key === 'x') gsap.to(el, { left: value })
                        if (key === 'y') gsap.to(el, { top: value })
                },
                onActive() {
                        gsap.to(ref.current, { opacity: 1 })
                },
                onDeactive() {
                        gsap.to(ref.current, { opacity: 0.1 })
                },
        })

        return (
                <div
                        ref={ref}
                        style={{
                                position: 'absolute',
                                zIndex: 1000,
                                userSelect: 'none',
                                pointerEvents: 'none',
                        }}
                >
                        <span style={style}></span>
                        <span>{' ' + username}</span>
                        {/* <span>{' ' + userId}</span> */}
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
        return webrtcTree._users.map((key) => <Cursor key={key} userId={key} />)
}
