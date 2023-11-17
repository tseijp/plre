import event, { EventState } from 'reev'
import { useCall, useOnce } from '.'

export interface VisibleState<El extends Element = Element> {
        _active: boolean
        active: boolean
        target: El
        isIntersecting: boolean
        event: Event
        mount(target: Element): void
        clean(target: null): void
        ref(traget: Element): void
        on(self: VisibleState<El>): void
        memo: any
        observer: IntersectionObserver
}

export const visibleEvent = <El extends Element = Element>(
        on: VisibleState<El>['on']
) => {
        const self = event({
                active: false,
                _active: false,
                mount(target: El) {
                        self.observer = new IntersectionObserver((entries) => {
                                entries.forEach((entry) => {
                                        self.isIntersecting =
                                                entry.isIntersecting
                                        self.on(self)
                                })
                        })
                        self({ on, target })
                        self.observer.observe(target)
                },
                clean() {
                        const { observer, target } = self
                        self({ on })
                        observer.observe(target)
                },
                ref(target: El | null) {
                        if (target) {
                                self.mount(target)
                        } else self.clean(null)
                },
        }) as EventState<VisibleState<El>>

        return self
}

export const useVisibleEvent = <El extends Element = Element>(
        _on: VisibleState<El>['on']
) => {
        const on = useCall(_on)
        const self = useOnce(() => visibleEvent<El>(on))
        return self
}
