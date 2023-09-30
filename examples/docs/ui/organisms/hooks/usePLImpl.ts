import { useMemo } from 'react'
import { frame } from 'refr'
import { createGL } from 'glre'
import { vs } from 'plre/shader'
import { collectAll } from 'plre/utils'
import { useMutable } from 'plre/react'
import { useCtx } from '../../ctx'
import { useOnce } from '../../atoms'
import type { PL } from 'plre/types'

export const usePLImpl = (props: Partial<PL>) => {
        const { objectTree } = useCtx()
        const self = useOnce(createGL)
        const memo1 = useMutable(props) as Partial<PL>
        const memo2 = useMutable({
                ref(target: unknown) {
                        if (target) {
                                self.target = target
                                self.mount()
                        } else self.clean()
                },
                mount() {
                        self.fs = collectAll(objectTree)
                        self.vs = vs
                        console.log(self.vs, self.fs)
                        self.el = self.target
                        self.gl = self.target.getContext('webgl2')
                        self.init()
                        self.resize()
                        frame.start()
                        window.addEventListener('resize', self.resize)
                        self.el.addEventListener('mousemove', self.mousemove)
                },
                clean() {
                        self(memo2)(memo1)
                        // @TODO fix refr
                        // frame.cancel()
                        window.removeEventListener('resize', self.resize)
                },
        }) as Partial<PL>
        return useMemo(() => self(memo2)(memo1), [self, memo1, memo2]) as PL
}
