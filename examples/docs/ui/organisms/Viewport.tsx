import * as React from 'react'
import { usePL } from 'plre/react'
import { Flex } from '../atoms/Flex'
import { Viewpoint } from '../molecules/Viewpoint'
import { useCallback } from '../hooks/useCallback'
import { useWheelEvent } from '../hooks/useWheelEvent'
import { useResizeEvent } from '../hooks/useResizeEvent'
import { clamp } from '../utils'

const { cos, sin, PI } = Math

export const Viewport = () => {
        const wheel = useWheelEvent((state) => {
                if (!state.active) return update()
                let [dx, dy] = state.delta
                const _ = wheel.memo
                if (state.e.ctrlKey) {
                        _.rad += dy / 10
                } else {
                        _.tht += dy / 300
                        _.phi -= (dx / 300) * (sin(_.tht) < 0 ? -1 : 1)
                }
                update()
        })

        const update = useCallback(() => {
                self.frame(() => {
                        let { tht, phi, rad } = wheel.memo
                        phi += Math.PI / 2
                        // @ts-ignore
                        const x = rad * sin(tht) * cos(phi)
                        const z = rad * sin(tht) * sin(phi)
                        const y = rad * cos(tht)
                        self.uniform({
                                cameraAngle: sin(tht) > 0 ? 0 : PI,
                                cameraPosition: [x, y, z],
                        })
                        self.clear()
                        self.viewport()
                        self.drawArrays()
                })
        })

        if (!wheel.memo) wheel.memo = { tht: 1.1, phi: 0.4, rad: 30 }

        const self = usePL({
                update,
                ref(el: Element) {
                        wheel.ref(el)
                        update()
                },
        })

        const ref = useResizeEvent(self.update)

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
