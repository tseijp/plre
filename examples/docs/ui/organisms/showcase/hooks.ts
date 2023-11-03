import { useState, useMemo } from 'react'
import { createGL } from 'glre'
import { ObjectState } from 'plre/types'
import { vs } from 'plre/shader'
import { collectAll } from 'plre/compile'
import { resolve } from 'plre/lygia'
import { uniformMat4All } from 'plre/utils'
import { useMutable } from 'plre/react'
import { useWheelEvent } from '../../atoms'
import { frame } from 'refr'

const { cos, sin, PI } = Math

const update = (self: any, memo: any) => {
        let { tht, phi, rad } = memo
        const x = rad * sin(tht) * cos(phi)
        const z = rad * sin(tht) * sin(phi)
        const y = rad * cos(tht)
        self.uniform({
                cameraAngle: sin(tht) > 0 ? 0 : PI,
                cameraPosition: [x, y, z],
                floorColor: [58 / 255, 58 / 255, 58 / 255],
        })
        self.frame(() => {
                self.clear()
                self.viewport()
                self.drawArrays()
        })
}

export const usePLImpl2 = (objectTree: ObjectState) => {
        const [self] = useState(createGL) as any

        const wheel = useWheelEvent((state) => {
                const { active, e, memo: _ } = state
                if (!active) return update(self, _)
                let [dx, dy] = state.delta
                if (e?.ctrlKey || _.zoom) {
                        _.rad += dy / 10
                } else {
                        _.tht += (dy / 300) * (_.rad < 0 ? -1 : 1)
                        _.phi -= (dx / 300) * (sin(_.tht) < 0 ? -1 : 1)
                }
                update(self, wheel.memo)
        })

        if (!wheel.memo) wheel.memo = { tht: 1.1, phi: 0.4, rad: 10 }

        const memo = useMutable({
                async mount(el: HTMLCanvasElement) {
                        wheel.mount(el)
                        self.el = self.target = el
                        self.gl = el.getContext('webgl2')
                        self.vs = vs
                        self.fs = await resolve(collectAll(objectTree))
                        // @TODO fix refr
                        frame.start()
                        uniformMat4All(self, objectTree)
                        self.gl.useProgram(self.pg)
                        self.resize(null, 1920, 1080)
                        self.init()
                        update(self, wheel.memo)
                        self.render()
                },
                clean() {
                        const { gl, pg } = self
                        gl?.deleteProgram?.(pg)
                        wheel.clean(null)
                },
                ref(el: HTMLCanvasElement) {
                        if (el) {
                                self.mount(el)
                        } else self.clean()
                },
        })
        return useMemo(() => self(memo), [self, memo])
}
