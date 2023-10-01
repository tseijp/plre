import { usePLImpl } from '.'
import { useWheelEvent, useResizeEvent } from '../../atoms'
import { useEffect } from 'react'

const { cos, sin, PI } = Math

export const useViewport = () => {
        /**
         * wheel event
         */
        const wheel = useWheelEvent((state) => {
                if (!state.active) return self.on()
                let [dx, dy] = state.delta
                const _ = wheel.memo
                if (state.e?.ctrlKey) {
                        _.rad += dy / 10
                } else {
                        _.tht += (dy / 300) * (_.rad < 0 ? -1 : 1)
                        _.phi -= (dx / 300) * (sin(_.tht) < 0 ? -1 : 1)
                }
                self.on()
        })

        if (!wheel.memo) wheel.memo = { tht: 1.1, phi: 0.4, rad: 30 }

        /**
         * resize event
         */
        const resize = useResizeEvent(() => () => {
                self.resize()
                self.on()
        })

        /**
         * pl event
         */
        const self = usePLImpl(() => {
                let { tht, phi, rad } = wheel.memo
                phi += Math.PI / 2 // @ts-ignore
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
        })

        useEffect(() => {
                try {
                        // recompile shader
                        self.ref?.(wheel.target)
                        self.on?.()
                        self.trySuccess?.()
                } catch (e) {
                        console.warn(e)
                        self.catchError?.(e)
                }
        }, [self])

        return [wheel, resize, self] as const
}
