import { useState, useRef } from 'react'

export const useForceUpdate = () => {
        const [, set] = useState(-1)
        return useRef(() => set(Math.random())).current
}
