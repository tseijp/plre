import { useState, useMemo } from 'react'
import { pl } from './'
import { frame } from 'refr'
import { mutable } from 'reev'
import { PL } from './types'
import type { MutableArgs } from 'reev/types'

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const [memo] = useState(() => mutable<T>())
        return memo(...args)
}

export const usePL = (props: Partial<PL> = {}, self = pl) => {
        const memo1 = useMutable(props) as Partial<PL>
        const memo2 = useMutable({
                ref(target: unknown) {
                        if (target) {
                                self.target = target
                                self.mount()
                        } else self.clean()
                },
                mount() {
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
