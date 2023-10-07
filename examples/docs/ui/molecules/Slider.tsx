import * as React from 'react'
import { useState } from 'react'
import { Arrow, Box, DragState, Flex, useRefs } from '../atoms'
import { useSliderEvent } from './hooks'
import { Editable } from '.'
import { round } from '../utils'

export interface SliderProps {
        onChange(
                value: number | ((prev: number) => number),
                isRoot?: boolean
        ): void
        children?: React.ReactNode
        title?: string
        value: number
        X?: boolean
        Y?: boolean
        Z?: boolean
}

export const Slider = (props: SliderProps) => {
        const { X, Y, Z, title, value, onChange = () => {} } = props
        const [isHover, set] = useState(false)
        const drag = useSliderEvent((state) => {
                const { active, delta } = state
                const [dx] = delta
                if (active) onChange((p) => round(p + dx / 100, 2), true)
        })

        const dec = () => onChange((p) => p - 1, true)

        const inc = () => onChange((p) => p + 1, true)

        const handleChange = (v: number) => {
                onChange(!v ? 0 : v, true)
        }

        const refs = useRefs() as any

        React.useEffect(() => {
                const { wrap, a, d } = refs
                if (!wrap.current || !a.current || !d.current) return
                wrap.current.addEventListener('mouseenter', () => set(true))
                wrap.current.addEventListener('mouseleave', () => set(false)) // @ts-ignore
                a.current?.addEventListener('click', dec)
                d.current?.addEventListener('click', inc)
        }, [])

        const name = X ? 'X' : Y ? 'Y' : Z ? 'Z' : title
        const w = '16px'
        const a = '#7979797f'
        const b = '#656565f2'
        const background = isHover
                ? `linear-gradient(to right, ${b} ${w}, ${a} ${w}, ${a} calc(100% - ${w}), ${b} calc(100% - ${w}))`
                : '#5454547f'

        return (
                <Flex
                        row
                        ref={refs('wrap')}
                        gap="1rem"
                        padding="0 5px"
                        style={{ padding: 0 }}
                        borderRadius="4px"
                        backdropFilter="blur(5px)"
                        background={background}
                >
                        <Arrow
                                a
                                cursor="pointer"
                                opacity={isHover ? '1' : '0'}
                                fontSize={7}
                                ref={refs('a')}
                        />
                        <Editable double value={value} onChange={handleChange}>
                                <Value
                                        ref={drag.ref}
                                        drag={drag}
                                        name={name}
                                        value={value}
                                />
                        </Editable>
                        <Arrow
                                d
                                right={0}
                                cursor="pointer"
                                opacity={isHover ? '1' : '0'}
                                fontSize={7}
                                ref={refs('d')}
                        />
                </Flex>
        )
}

interface ValueProps {
        name: string
        drag: DragState
        value: number
}

const Value = React.forwardRef((props: ValueProps, ref) => {
        const { name, value } = props
        return (
                <Flex
                        ref={ref}
                        row
                        width={135}
                        minWidth={135}
                        userSelect="none"
                >
                        <Box>{name}</Box>
                        <Box textAlign="right">
                                {round(value)}
                                {'  '}m
                        </Box>
                </Flex>
        )
})
