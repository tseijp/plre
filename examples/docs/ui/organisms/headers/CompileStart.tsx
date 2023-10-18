import * as React from 'react'
import { useCompile } from '../hooks'
import { HeaderButton } from '../../molecules'
import { Button } from '../../atoms/Button'

export const CompileStart = () => {
        const compile = useCompile()
        const handleClick = () => void compile()

        return (
                <Button onClick={handleClick}>
                        <HeaderButton>
                                <div children="▶️"></div>
                        </HeaderButton>
                </Button>
        )
}
