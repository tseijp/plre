import { useMemo, useState, useEffect } from 'react'
import { frame } from 'refr'
import { createGL } from 'glre'
import { resolve } from 'plre/lygia'
import { vs } from 'plre/shader'
import { collectAll } from 'plre/compile'
import { useMutable } from 'plre/react'
import { useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import type { PL } from 'plre/types'
import type { WheelState } from '../../atoms'
import { uniformMat4All } from 'plre/utils'

const aMat = [
        1.0,
        0.0,
        0.0,
        1.0, // 1. column
        0.0,
        1.0,
        0.0,
        100.0, // 2. column
        0.0,
        0.0,
        0.1,
        1.0, // 3. column
        1.0,
        -1.0,
        0.0,
        1.0,
]

export const usePLImpl = (wheel: WheelState, on = () => {}) => {
        const { objectTree, editorTree } = useCtx()
        const [self, set] = useState(createGL)
        const cache = useOnce(() => ({ vs, fs: collectAll(objectTree) }))
        const memo = useMutable({
                on,
                ref(target: unknown) {
                        if (target) {
                                self.target = target
                                self.mount()
                        } else self.clean()
                },
                async mount() {
                        // using lygia
                        self.el = self.target
                        self.vs = cache.vs
                        self.fs = cache.fs
                        console.log(self.fs)
                        self.gl = self.el.getContext('webgl2')
                        self.init()
                        uniformMat4All(self as PL, objectTree)
                        // @ts-ignore
                        self.uniform('aMat', aMat, true)
                        self.resize()
                        frame.start()
                        window.addEventListener('resize', self.resize)
                        self.el.addEventListener('mousemove', self.mousemove)

                        // @ts-ignore plre specific
                        editorTree({ compileShader })
                },
                clean() {
                        self(memo)
                        // @TODO fix refr
                        // frame.cancel()
                        window.removeEventListener('resize', self.resize)

                        try {
                                const { gl, pg } = self
                                gl.deleteProgram(pg)
                        } catch (e) {
                                console.warn(e)
                        }

                        // @ts-ignore plre specific
                        editorTree({ compileShader })
                },
        }) as Partial<PL>

        const compileShader = (code: string) => {
                const ret = createGL()
                // @ts-ignore
                cache.fs = code
                // cache.fs = ''
                // cache.vs = ''
                ret.target = self.target
                set((p) => {
                        p.clean?.()
                        return ret
                })
        }

        useEffect(() => {
                ;(async () => {
                        try {
                                // recompile shader
                                self.el = self.target = wheel.target
                                cache.fs = await resolve(cache.fs)
                                self.mount?.()
                                // @ts-ignore
                                self.on?.()

                                // Pub shader code if compile succeeds
                                editorTree.trySuccess?.()
                        } catch (e) {
                                console.warn(e)
                                editorTree.catchError?.(e)
                        }
                })()
        }, [self])

        return useMemo(() => self(memo), [self, memo]) as PL
}
