import { useMemo, useState } from 'react'
import { frame } from 'refr'
import { createGL } from 'glre'
import { vs } from 'plre/shader'
import { collectAll } from 'plre/compile'
import { useMutable } from 'plre/react'
import { useCtx } from '../../ctx'
import type { PL } from 'plre/types'
import { useOnce } from '../../atoms'

export const usePLImpl = (on = () => {}) => {
        const { objectTree } = useCtx()
        const [self, set] = useState(createGL)
        const cache = useOnce(() => ({ vs, fs: collectAll(objectTree) }))
        const memo = useMutable({
                on,
                ref(target: unknown) {
                        console.log('usePLImpl useMutable -> target', target)
                        if (target) {
                                self.target = target
                                self.mount()
                        } else self.clean()
                },
                mount() {
                        // @ts-ignore
                        self.X = (Math.random() * 100) << 0
                        self.fs = cache.fs
                        self.vs = cache.vs
                        self.el = self.target
                        self.gl = self.target.getContext('webgl2')
                        self.init()
                        self.resize()
                        frame.start()
                        window.addEventListener('resize', self.resize)
                        self.el.addEventListener('mousemove', self.mousemove)

                        // @ts-ignore plre specific
                        objectTree({ compileShader })
                },
                clean() {
                        self(memo)
                        // @TODO fix refr
                        // frame.cancel()
                        window.removeEventListener('resize', self.resize)

                        // @ts-ignore plre specific
                        objectTree({ compileShader })
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
                        p.clean()
                        return ret
                })
        }

        return useMemo(() => self(memo), [self, memo]) as PL
}
