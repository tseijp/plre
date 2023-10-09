import * as React from 'react'

export interface ButtonProps extends React.CSSProperties {
        children?: React.ReactNode
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
        onDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
        onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
        onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Button = (props: ButtonProps) => {
        const {
                children,
                onClick,
                onDoubleClick,
                onMouseEnter,
                onMouseLeave,
                ...other
        } = props
        return (
                <div
                        children={children}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{
                                cursor: 'pointer',
                                display: 'flex',
                                margin: 0,
                                padding: '0',
                                alignItems: 'center',
                                justifyContent: 'center',
                                userSelect: 'none',
                                lineHeight: 'normal',
                                background: '#282828',
                                borderRadius: '4px',
                                border: '1px solid #3D3D3D',
                                ...other,
                        }}
                />
        )
}
