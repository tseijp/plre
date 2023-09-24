import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useCall, useOnce } from '../../atoms'
import { useCtx } from '../../ctx'

const TICK_TIMEOUT_MS = 1000

export const useUserCursor = (userId: string) => {
        const { webrtcTree } = useCtx()
        const { ydoc } = webrtcTree

        const [username, setUsername] = useState('anonymous')
        const ref = useRef()
        const user = useOnce(() => ydoc.getMap(userId)) as any

        const update = useCall((key) => {
                if (key === 'username') setUsername(user.get(key))
                const el = ref.current
                if (!el) return
                if (key === 'x') gsap.to(el, { left: user.get(key) })
                if (key === 'y') gsap.to(el, { top: user.get(key) })
        })

        const cleanup = useOnce(() => {
                let listener = () => {}
                let timeoutId: number | any = 0
                user.observe((e: any) => {
                        if (e.transaction.local) return
                        gsap.to(ref.current, { opacity: 1 })
                        listener()
                        listener = () => clearTimeout(timeoutId)
                        timeoutId = setTimeout(() => {
                                gsap.to(ref.current, { opacity: 0.1 })
                        }, TICK_TIMEOUT_MS)

                        e.changes.keys.forEach((_: any, key = '') => {
                                update(key)
                        })
                })
                return () => {
                        listener()
                        clearTimeout(timeoutId)
                }
        })

        useEffect(() => {
                update('x')
                update('y')
                update('username')
                return cleanup
        }, [])

        return { ref, username }
}
