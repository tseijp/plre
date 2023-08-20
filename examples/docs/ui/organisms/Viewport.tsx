import * as React from 'react'
import { useState } from 'react'
import { usePL } from 'plre/react'
import { Flex } from '../atoms/Flex'
import { quat, vec3, mat4 } from 'gl-matrix'
import { Viewpoint } from '../molecules/Viewpoint'
import { useCallback } from '../hooks/useCallback'
import { useWheelEvent } from '../hooks/useWheelEvent'
import { useResizeEvent } from '../hooks/useResizeEvent'
import { clamp } from '../utils'

export const Viewport = () => {
        const [_] = useState(() => ({
                rot: quat.create(),
                mat: mat4.create(),
                ini: vec3.fromValues(0, 0, -30),
                vec: vec3.fromValues(0, 0, 0),
        }))

        const move = useCallback(() => {
                // @ts-ignore
                const [x, y, z] = _.vec
                self.uniform({ cameraPosition: [x, y, z] })
                self.clear()
                self.viewport()
                self.drawArrays()
        })

        const wheel = useWheelEvent((state) => {
                if (!state.active) return
                let [dx, dy] = state.delta
                if (state.e.ctrlKey) {
                        _.ini[2] = clamp(_.ini[2] + dy / 5, 0, 100)
                        vec3.transformMat4(_.vec, _.ini, _.mat)
                } else {
                        const tmp = quat.create()
                        quat.rotateX(tmp, tmp, -dy / 600)
                        quat.rotateY(tmp, tmp, dx / 300)
                        quat.multiply(_.rot, tmp, _.rot)
                        mat4.fromQuat(_.mat, _.rot)
                        vec3.transformMat4(_.vec, _.ini, _.mat)
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
                        backgroundColor="#303030"
                        transformStyle="preserve-3d"
                >
                        <Flex backgroundColor="#303030" height="25px"></Flex>
                        <Flex background="#3A3A3A">
                                <canvas ref={self.ref} />
                        </Flex>
                        <Viewpoint s={16} wheel={wheel} />
                </Flex>
        )
}
