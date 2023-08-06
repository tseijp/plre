import { useState, useEffect, useMemo } from 'react'
import { mutable } from 'reev'
import type { MutableArgs } from 'reev/types'

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const [memo] = useState(() => mutable<T>())
        return memo(...args)
}
