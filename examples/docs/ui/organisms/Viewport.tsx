import * as React from 'react'
import { usePL } from 'plre/react'
import { Flex } from '../atoms/Flex'
import { Viewpoint } from '../molecules/Viewpoint'
import { useCallback } from '../hooks/useCallback'
import { useWheelEvent } from '../hooks/useWheelEvent'
import { useResizeEvent } from '../hooks/useResizeEvent'

const { cos, sin } = Math

export const Viewport = () => {
        let phi = 0.12
        let tht = 1
        let r = 15
        const move = useCallback(() => {
                const x = r * sin(tht) * cos(phi)
                const z = r * sin(tht) * sin(phi)
                const y = r * cos(tht)
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
                        phi -= dx / 300
                        tht -= dy / 600
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
                        <Viewpoint s={10} wheel={wheel} />
                </Flex>
        )
}
