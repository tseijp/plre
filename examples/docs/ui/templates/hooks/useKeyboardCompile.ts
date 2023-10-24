import { EditorState, ObjectState } from 'plre/types'
import { useKeyboardEvent } from '../../atoms/hooks/useKeyboardEvent'
import { useCompile_ } from '../../organisms'

function isCompile(e: KeyboardEvent) {
        const isEnter = e.code === 'Enter'
        const isShift = e.shiftKey
        if (isEnter && isShift) return true
        const isCtrl = e.ctrlKey || e.metaKey
        if (isEnter && isCtrl) return true
        return false
}
export const useKeyboardCompile = (
        objectTree: ObjectState,
        EditorTree: EditorState
) => {
        const compile = useCompile_(objectTree, EditorTree)
        const keyboard = useKeyboardEvent((state) => {
                if (isCompile(state.event)) {
                        state.event.preventDefault()
                        compile()
                }
        })

        return keyboard
}
