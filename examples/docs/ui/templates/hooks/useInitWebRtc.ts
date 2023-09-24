// @ts-ignore
import * as Y from 'yjs'
// @ts-ignore
import { WebrtcProvider } from 'y-webrtc'
import { useOnce } from '../../atoms'
import event from 'reev'
import { useEffect } from 'react'
// import type { PLObject } from 'plre/types'

export interface WebrtcState {
        isDev: boolean
        isInit: boolean
        color: stringd
        username: string
        _users: string[]
        checkers: Map<string, () => void>
        mount(): void
        clean(): void
        updateUsers(): void
        // after mount
        userId: string
        roomId: string
        ydoc: Y.Doc
        provider: WebrtcProvider
        users: Y.Map<any>
        user: Y.Map<any>
}

const TICK_TIMEOUT_MS = 1000

const createChecker = (key: string, callback = (_key: string) => {}) => {
        let timeoutId = 0 as any
        let listeners = () => {}
        const fun = () => callback(key)
        return () => {
                listeners()
                timeoutId = setTimeout(fun, TICK_TIMEOUT_MS * 5)
                listeners = () => clearTimeout(timeoutId)
        }
}

export const createWebrtc = () => {
        const username = USER_NAMES[floor(random() * USER_NAMES.length)]

        const removeUser = (key: string) => {
                self.users.delete(key)
                self.checkers.delete(key)
                const isExist = self._users.includes(key)
                if (isExist) {
                        self._users = self._users.filter((user) => user !== key)
                        self.updateUsers()
                }
                self.users.set(key, '')
        }

        const observeUsers = (e: any) => {
                if (e.transaction.local) return
                const ymap = self.users
                let arr = self._users
                e.changes.keys.forEach((_: any, key = '') => {
                        if (!self.checkers.has(key)) {
                                const checker = createChecker(key, removeUser)
                                self.checkers.set(key, checker)
                        }
                        self.checkers.get(key)!?.()
                        const roomId = ymap.get(key)
                        const isExist = arr.includes(key)
                        if (roomId === self.roomId)
                                arr = isExist ? arr : [...arr, key]
                        else
                                arr = isExist
                                        ? arr.filter((user) => user !== key)
                                        : arr
                })
                if (arr !== self._users) self.updateUsers()
                self._users = arr
        }

        const mousemove = (e: MouseEvent) => {
                self.user.set('x', e.clientX << 0)
                self.user.set('y', e.clientY << 0)
        }

        const mount = () => {
                const params = new URLSearchParams(window.location.search)
                const roomId = (self.roomId =
                        params.get('roomId') || '' + floor(random() * 100))
                const userId = (self.userId =
                        params.get('userId') ||
                        floor(random() * 1000000000000) + '')
                const query = `?roomId=${roomId}&userId=${userId}`

                if (self.isInit) return
                self.isInit = true
                self.ydoc = new Y.Doc()
                if (self.isDev)
                        self.roomId = self.roomId + floor(random() * 100)
                self.provider = new WebrtcProvider(self.roomId, self.ydoc)
                // set users
                self.users = self.ydoc.getMap('users')
                self.users.set(userId, roomId)
                self.users.observe(observeUsers)

                // set user info
                self.user = self.ydoc.getMap(userId)
                self.user.set('username', username)
                self.user.set('color', self.color)

                const tick = () => {
                        self.users.set(userId, roomId)
                        setTimeout(tick, TICK_TIMEOUT_MS)
                }

                setTimeout(tick, TICK_TIMEOUT_MS)
                window.history.replaceState(null, '', query)
                window.addEventListener('mousemove', mousemove)
        }

        const clean = () => {
                window.removeEventListener('mousemove', mousemove)
                self.users.unobserve(observeUsers)
                self.provider.disconnect()
                self.provider.destroy()
        }

        const self = event<WebrtcState>({
                isInit: false,
                // isDev: process.env.NODE_ENV === 'development',
                username,
                checkers: new Map(),
                color: NICE_COLORS[floor(random() * NICE_COLORS.length)],
                _users: [],
                mount,
                clean,
        })

        return self
}

const { floor, random } = Math

export const useInitWebrtc = () => {
        const webrtc = useOnce(createWebrtc)

        useEffect(() => void webrtc.mount(), [])
        useEffect(() => () => webrtc.clean(), [])

        return webrtc
}

const USER_NAMES = [
        'Akechi',
        'Baba',
        'Chosokabe',
        'Date',
        'Edward',
        'Fuuma',
        'Gamo',
        'Honda',
        'Imagawa',
        'Jinbo',
        'Katakura',
        'Li',
        'Maeda',
        'Naoe',
        'Oda',
        'Pierre',
        'Qiu',
        'Rokkaku',
        'Shibata',
        'Takeda',
        'Uesugi',
        'Vettor',
        'William',
        'Xu',
        'Yoshida',
        'Zhang',
]

const NICE_COLORS = [
        '#e60012',
        '#f39800',
        '#fff100',
        '#009944',
        '#0068b7',
        '#1d2088',
        '#920783',
        '#e4007f',
        '#9caeb7',
        '#00a0e9',
        // '#ffffff',
        // '#f5f4f4',
        // '#d9d9d9',
        // '#666666',
]
