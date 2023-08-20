import * as React from 'react'
import { usePL } from 'plre/react'
import { Flex } from '../atoms/Flex'
import { quat, vec3, mat4 } from 'gl-matrix'
import { Viewpoint } from '../molecules/Viewpoint'
import { useCallback } from '../hooks/useCallback'
import { useWheelEvent } from '../hooks/useWheelEvent'
import { useResizeEvent } from '../hooks/useResizeEvent'

let r = 30
let rot = quat.create()
let pos = mat4.create()
let ini = vec3.fromValues(0, 0, -r)
let vec = vec3.fromValues(0, 0, 0)

export const Viewport = () => {
        const move = useCallback(() => {
                // @ts-ignore
                const [x, y, z] = vec
                self.uniform({ cameraPosition: [x, y, z] })
                self.clear()
                self.viewport()
                self.drawArrays()
        })

        const wheel = useWheelEvent((state) => {
                if (!state.active) return
                let [dx, dy] = state.delta
                if (state.e.ctrlKey) {
                        r += dy / 25
                } else {
                        const tmp = quat.create()
                        quat.rotateX(tmp, tmp, -dy / 600)
                        quat.rotateY(tmp, tmp, dx / 300)
                        quat.multiply(rot, tmp, rot)
                        mat4.fromQuat(pos, rot)
                        vec3.transformMat4(vec, ini, pos)
                }
                move()
        })

        const self = usePL({
                ref(el: Element) {
                        wheel.ref(el)
                },
        })

        const ref = useResizeEvent(() => {
                self.frame(() => move())
        })

        return (
                <Flex
                        ref={ref}
                        background="#3A3A3A"
                        transformStyle="preserve-3d"
                >
                        <canvas ref={self.ref} />
                        <Viewpoint s={16} wheel={wheel} />
                </Flex>
        )
}
