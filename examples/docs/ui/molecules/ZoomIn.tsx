import * as React from 'react'
import { WheelState, ZoomInIcon } from '../atoms'
import { useZoomEvent } from './hooks/useZoomEvent'

export interface ZoomInProps {
        wheel: WheelState
}

export const ZoomIn = (props: ZoomInProps) => {
        const { wheel } = props
        const zoom = useZoomEvent(wheel, true)
        return (
                <div ref={zoom.ref}>
                        <ZoomInIcon
                                s={25}
                                top="155px"
                                color="white"
                                right="10px"
                                padding="2px"
                                position="absolute"
                                fontSize="2rem"
                                borderRadius={9999}
                                backdropFilter="blur(1px)"
                                // backgroundColor="red"
                                backgroundColor="rgba(42, 42, 42, 0.75)"
                                transform="scale(-1,1)"
                                cursor="pointer"
                        />
                </div>
        )
}
