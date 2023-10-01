import { useEffect } from 'react'
import { useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import { useMutable } from 'plre/react'

const TICK_TIMEOUT_MS = 1000

export interface UseUserObserveHandlers {
        onUpdate(key: string): void
        onActive?(): void
        onDeactive?(): void
}

export const useUserObserve = (
        userId: string,
        handlers: UseUserObserveHandlers
) => {
        const { webrtcTree } = useCtx()
        const { ydoc } = webrtcTree
        const {
                onUpdate,
                onActive = () => {},
                onDeactive = () => {},
        } = useMutable<UseUserObserveHandlers>(handlers)

        const user = useOnce(() => ydoc.getMap(userId)) as any

        const cleanup = useOnce(() => {
                let listener = () => {}
                let timeoutId: number | any = 0
                user.observe((e: any) => {
                        if (e.transaction.local) return
                        onActive()
                        listener()
                        listener = () => clearTimeout(timeoutId)
                        timeoutId = setTimeout(onDeactive, TICK_TIMEOUT_MS)
                        e.changes.keys.forEach((_: any, key = '') => {
                                onUpdate(key)
                        })
                })
                return () => {
                        listener()
                        clearTimeout(timeoutId)
                }
        })

        useEffect(() => {
                onUpdate('x')
                onUpdate('y')
                onUpdate('color')
                onUpdate('username')
                return cleanup
        }, [])

        return user
}
