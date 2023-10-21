import { useCall, useOnce } from '../../atoms'

export const useFileSelect = (_on = (_: any) => {}) => {
        const on = useCall(_on)

        const self = useOnce(() => ({
                on,
                change(e: Event) {
                        e.preventDefault()
                        if (e.target instanceof HTMLInputElement)
                                self.on(...Array.from(e.target.files))
                },
                ref(el: Element) {
                        el.addEventListener('change', self.change)
                },
        }))

        return self
}
