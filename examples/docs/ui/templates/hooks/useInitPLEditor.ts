import { useForceUpdate, useOnce } from '../../atoms'
import { createEditor } from 'plre'

export const createPLEditor = (forceUpdate = () => {}) => {
        // const viewport = createEditor('viewlayer')
        const viewport = createEditor('viewport')
        const timeline = createEditor('timeline')
        const viewlayer = createEditor('viewlayer')
        const properties = createEditor('properties')
        const left = createEditor('I', { rate: [0.92, 0.08] }, [
                viewport,
                timeline,
        ])
        const right = createEditor('I', { rate: [0.33, 0.67] }, [
                viewlayer,
                properties,
        ])
        const top = createEditor(
                'I',
                { rate: [0.83, 0.17], row: true, top: true, forceUpdate }, // @TODO RENAME
                [left, right]
        )

        return top
}

export const useInitPLEditor = () => {
        const forceUpdate = useForceUpdate()
        return useOnce(() => createPLEditor(forceUpdate))
}
