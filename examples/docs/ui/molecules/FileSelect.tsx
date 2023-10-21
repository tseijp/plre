import * as React from 'react'
import { useFileSelect } from './hooks/useFileSelect'

export interface FileSelectProps {
        on(_: any): void
}

export const FileSelect = (props: FileSelectProps) => {
        const self = useFileSelect(props.on)
        return <input type="file" ref={self.ref} style={{ display: 'none' }} />
}
