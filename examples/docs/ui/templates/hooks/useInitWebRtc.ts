// @ts-ignore
import * as Y from 'yjs'
// @ts-ignore
import { WebrtcProvider } from 'y-webrtc'
import { useCall, useForceUpdate, useOnce } from '../../atoms'
import event from 'reev'
import { pubShaderAll } from 'plre/connect'
import { useEffect, useState } from 'react'
import { EditorState, ObjectState } from 'plre/types'
import { useCompile_ } from '../../organisms'
import { createURL } from '../../organisms/headers/utils'
import { createChecker } from './utils'

let isDev = false
// isDev = process.env.NODE_ENV === 'development'

let isPubSub = true
// isPubSub = false
// @TODO move to connection

export interface WebrtcState {
        isDev: boolean
        isInit: boolean
        isReady: boolean
        color: string
        username: string
        _users: string[]
        checkers: Map<string, () => void>

        // events
        mount(): void
        clean(): void
        connected(): void
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

const CONNECTED_TIMEOUT_MS = 100

export const createWebrtc = (objectTree: ObjectState) => {
        const username = USER_NAMES[floor(random() * USER_NAMES.length)]

        /**
         * users
         */
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

        /**
         * mount and clean
         */
        const checkConnected = () => {
                const { provider } = self
                let id = 0 as any
                const tick = () => {
                        if (!provider.connected)
                                id = setTimeout(tick, CONNECTED_TIMEOUT_MS)
                        else {
                                id = 0
                                self.connected?.()
                        }
                }
                self('clean', () => id && clearTimeout(id))
                tick()
        }

        const mount = () => {
                if (!isPubSub) return self.connected?.()

                const url = createURL()

                self.roomId = url.get('id') || floor(random() * 100) + ''
                self.userId = url.get('userId') || floor(random() * 100000) + ''

                // random roomId if dev
                if (self.isDev) self.roomId = floor(random() * 100) + 'DEV'

                url.set('id', self.roomId)

                if (self.isInit) return
                self.isInit = true

                // init yjs
                self.ydoc = new Y.Doc()
                self.provider = new WebrtcProvider(self.roomId, self.ydoc)
                checkConnected()

                // set users
                self.users = self.ydoc.getMap('users')
                self.users.set(self.userId, self.roomId)
                self.users.observe(observeUsers)

                // set user info
                self.user = self.ydoc.getMap(self.userId)
                self.user.set('username', username)
                self.user.set('color', self.color)

                const tick = () => {
                        self.users.set(self.userId, self.roomId)
                        setTimeout(tick, TICK_TIMEOUT_MS)
                }

                setTimeout(tick, TICK_TIMEOUT_MS)
                url.replaceState()
                window.addEventListener('mousemove', mousemove)
        }

        const clean = () => {
                window.removeEventListener('mousemove', mousemove)
                self.users.unobserve(observeUsers)
                self.provider.destroy()
                self.provider.disconnect()
        }

        const self = event<WebrtcState>({
                isInit: false,
                isDev,
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

export const useInitWebrtc = (
        objectTree: ObjectState,
        editorTree: EditorState
) => {
        const [isReady, set] = useState(false)
        const forceUpdateRoot = useForceUpdate()
        const compileShader = useCompile_(objectTree, editorTree)
        const trySuccess = useCall(() => {
                pubShaderAll(objectTree)
        })

        const webrtcTree = useOnce(() => {
                const self = createWebrtc(objectTree)
                self('connected', () => set(true))
                // @ts-ignore
                editorTree({ trySuccess })
                return self
        })

        const updateUniform = useCall((obj) => {
                editorTree.updateUniform?.(obj)
        })

        useEffect(() => void webrtcTree.mount(), [])
        useEffect(() => () => webrtcTree.clean(), [])

        objectTree.memo.updateUniform = updateUniform
        objectTree.memo.compileShader = compileShader
        objectTree.memo.forceUpdateRoot = forceUpdateRoot
        webrtcTree.isReady = isReady

        return webrtcTree
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
]
