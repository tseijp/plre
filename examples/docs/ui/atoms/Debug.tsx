import * as React from 'react'

export const Debug = () => {
        return (
                <img
                        src="/img/debug.png"
                        style={{
                                position: 'fixed',
                                width: `${1279}px`,
                                pointerEvents: 'none',
                                opacity: 0.5,
                                top: `10px`,
                        }}
                />
        )
}
