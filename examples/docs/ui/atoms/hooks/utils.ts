export type Vec2 = [number, number]

export const addV = (a: Vec2, b: Vec2) => [a[0] + b[0], a[1] + b[1]] as Vec2

export const subV = (a: Vec2, b: Vec2) => [a[0] - b[0], a[1] - b[1]] as Vec2

const LINE_HEIGHT = 40

const PAGE_HEIGHT = 800

export const wheelValues = (event: WheelEvent) => {
        let { deltaX, deltaY, deltaMode } = event
        if (deltaMode === 1) {
                deltaX *= LINE_HEIGHT
                deltaY *= LINE_HEIGHT
        } else if (deltaMode === 2) {
                deltaX *= PAGE_HEIGHT
                deltaY *= PAGE_HEIGHT
        }
        return [deltaX, deltaY] as Vec2
}

const isBrowser =
        typeof window !== 'undefined' &&
        !!window.document &&
        !!window.document.createElement

const supportsTouchEvents = () => isBrowser && 'ontouchstart' in window

const isTouchScreen = () =>
        supportsTouchEvents() ||
        (isBrowser && window.navigator.maxTouchPoints > 1)

const supportsPointerEvents = () => isBrowser && 'onpointerdown' in window

const supportsPointerLock = () =>
        isBrowser && 'exitPointerLock' in window.document

function supportsGestureEvents(): boolean {
        try {
                // @ts-ignore
                return 'constructor' in GestureEvent
        } catch (e) {
                return false
        }
}

// prettier-ignore
export const SUPPORT = {                   // Mac
        isBrowser,                         // true
        gesture: supportsGestureEvents(),  // false
        touch: supportsTouchEvents(),      // false
        touchscreen: isTouchScreen(),      // false
        pointer: supportsPointerEvents(),  // true
        pointerLock: supportsPointerLock(),// true
}
