import { useMemo } from 'react'
import { useWindowSize } from '../../atoms'
import { EDITOR_GAP_SIZE, HEADER_PADDING_SIZE } from '../../utils'

export const useSeparatorSize = (
        len: number, // rate.length
        row: boolean = false
) => {
        let [w, h] = useWindowSize()
        const gap = EDITOR_GAP_SIZE
        w -= gap * 2 // padding
        h -= gap * 2 // padding
        h -= HEADER_PADDING_SIZE // header
        const size = (row ? w : h) - gap * (len - 1) // px
        return useMemo(() => size, [size])
}
