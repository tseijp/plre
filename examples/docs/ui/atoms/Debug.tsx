import * as React from 'react'
import { useState, useEffect } from 'react'

const clamp = (x = 0, a = 0, b = 1) => Math.min(Math.max(x, a), b)

export const Debug = () => {
        const [opacity, set] = useState(0)

        useEffect(() => {
                let opacity = Number(localStorage.getItem('opacity'))
                if (isNaN(opacity) || typeof opacity !== 'number') opacity = 0
                set(opacity)
                const callback = (e: KeyboardEvent) => {
                        if (e.key === 'ArrowLeft')
                                set((p) => clamp(p - 0.1, 0, 1))
                        if (e.key === 'ArrowRight')
                                set((p) => clamp(p + 0.1, 0, 1))
                }
                window.addEventListener('keydown', callback)
                return () => {
                        window.removeEventListener('keydown', callback)
                }
        }, [])

        useEffect(() => {
                localStorage.setItem('opacity', String(opacity))
        }, [opacity])

        return (
                <img
                        src="/img/debug.png"
                        style={{
                                position: 'fixed',
                                width: `${1279}px`,
                                pointerEvents: 'none',
                                opacity,
                                // filter: 'invert(100%)',
                                top: `10px`,
                        }}
                />
        )
}
