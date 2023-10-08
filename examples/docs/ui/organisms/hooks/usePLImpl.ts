import { useMemo, useState, useEffect } from 'react'
import { frame } from 'refr'
import { createGL } from 'glre'
import { resolve } from 'plre/lygia'
import { vs } from 'plre/shader'
import { collectAll } from 'plre/compile'
import { useMutable } from 'plre/react'
import { useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import { uniformMat4, uniformMat4All } from 'plre/utils'
import type { PL, PLObject } from 'plre/types'
import type { WheelState } from '../../atoms'

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
                        self.el = self.target
                        self.vs = cache.vs
                        self.fs = cache.fs
                        self.gl = self.el.getContext('webgl2')
                        self.init()
                        uniformMat4All(self as PL, objectTree)
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

        /**
         * compile if subscribe glsl code or click start button after edit
         */
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

        /**
         * update if subscribe uniform or change uniform via slider
         */
        const updateUniform = (obj: PLObject) => {
                uniformMat4(self as PL, obj)
                // @ts-ignore
                self.on?.()
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

                                // @ts-ignore register event to update uniform by subscribe
                                editorTree({ updateUniform })

                                // Pub shader code if compile succeeds
                                editorTree.trySuccess?.()
                        } catch (e) {
                                console.warn(e)
                                editorTree.catchError?.(e)
                        }
                })()
                return () => {
                        // @ts-ignore
                        editorTree({ updateUniform })
                }
        }, [self])

        return useMemo(() => self(memo), [self, memo]) as PL
}
