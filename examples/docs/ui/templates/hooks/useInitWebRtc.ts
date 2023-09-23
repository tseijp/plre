import { Webrtc } from './useInitWebRtc'
// @ts-ignore
import * as Y from 'yjs'
// @ts-ignore
import { WebrtcProvider } from 'y-webrtc'
import { useOnce } from '../../atoms'
import event from 'reev'
import { useEffect } from 'react'
// import type { PLObject } from 'plre/types'

const HEAT_BEAT_TS = 1000

export interface WebrtcState {
        x: number
        y: number
        ydoc: Y.Doc
        username: string
        roomId: string
        users: Y.Map<Y.Map<any>>
        provider: WebrtcProvider
        mount(): void
        clean(): void
}

export const createWebrtc = () => {
        const username = USER_NAMES[floor(random() * USER_NAMES.length)]
        const roomId = username + floor(random() * 1000)
        const ydoc = new Y.Doc()
        const users = ydoc.getMap('users')
        const user = ydoc.getMap(username)
        const provider = new WebrtcProvider(roomId, ydoc)

        users.set(username, roomId)
        user.set('name', username)
        user.set('color', floor(random() * 360))
        // user.set('x', 100)
        // user.set('y', 100)

        let timeoutId = 0

        const mousemove = (e: MouseEvent) => {
                self.x = e.clientX
                self.y = e.clientY
        }

        const mount = () => {
                window.addEventListener('mousemove', mousemove)
                const tick = () => {
                        user.set('x', self.x)
                        user.set('y', self.y)
                        setTimeout(tick, HEAT_BEAT_TS)
                }
                setTimeout(tick, HEAT_BEAT_TS)
        }

        const clean = () => {
                window.removeEventListener('mousemove', mousemove)
                clearTimeout(timeoutId)
                provider.destroy()
        }

        const self = event<WebrtcState>({
                ydoc,
                roomId,
                users,
                username,
                provider,
                mount,
                clean,
        })

        return self
}

const { floor, random } = Math

export const useInitWebrtc = () => {
        const webrtc = useOnce(createWebrtc)

        useOnce(webrtc.mount)
        useEffect(() => webrtc.clean, [])

        return webrtc
}

const USER_NAMES = [
        'Alice',
        'Bob',
        'Charlie',
        'Dave',
        'Eve',
        'Frank',
        'Grace',
        'Heidi',
        'Ivan',
        'Judy',
        'Mallory',
        'Olivia',
        'Pat',
        'Quinn',
        'Sybil',
        'Ted',
        'Ursula',
        'Victor',
        'Walter',
        'Xavier',
        'Yvonne',
        'Zelda',
]
