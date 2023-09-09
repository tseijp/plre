import { useState } from 'react'
import { createPL } from 'plre'
import { usePL } from 'plre/react'
import { useCall } from '../../atoms'
import { useWheelEvent, useResizeEvent } from '../../atoms'
import type { PL } from 'plre/types'
const { cos, sin, PI } = Math

export const useViewport = () => {
        /**
         * wheel event
         */
        const wheel = useWheelEvent((state) => {
                if (!state.active) return update()
                let [dx, dy] = state.delta
                const _ = wheel.memo
                if (state.e?.ctrlKey) {
                        _.rad += dy / 10
                } else {
                        _.tht += (dy / 300) * (_.rad < 0 ? -1 : 1)
                        _.phi -= (dx / 300) * (sin(_.tht) < 0 ? -1 : 1)
                }
                update()
        })

        if (!wheel.memo) wheel.memo = { tht: 1.1, phi: 0.4, rad: 30 }

        /**
         * resize event
         */
        const resize = useResizeEvent((entry: ResizeObserverEntry) => () => {
                self.width = entry.contentRect.width
                self.height = entry.contentRect.height
                self.resize()
                update()
        })

        /**
         * pl event
         */
        const update = useCall(() =>
                self.frame(() => {
                        let { tht, phi, rad } = wheel.memo
                        phi += Math.PI / 2 // @ts-ignore
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
        )
        const self = usePLImpl({
                update,
                ref(el: Element) {
                        wheel.ref(el)
                        update()
                },
        })

        return [wheel, resize, self] as const
}

const usePLImpl = (props: Partial<PL>) => {
        const [self] = useState(() => createPL())
        return usePL(props, self)
}
