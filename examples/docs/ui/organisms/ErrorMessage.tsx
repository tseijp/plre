import * as React from 'react'
import { useState, useEffect } from 'react'
import { Flex, Box, useRefs, useOnce } from '../atoms'
import { PL } from 'plre/types'
import { useCtx } from '../ctx'

export interface ErrorMessageProps {
        self: PL
}

export const ErrorMessage = (props: ErrorMessageProps) => {
        const { self } = props
        const { editorTree } = useCtx()
        const [display, setDisplay] = useState(false)
        const [err, setErr] = useState('')
        const cache = useOnce(() => ({ err }))
        const refs = useRefs()

        useEffect(() => {
                const { flex, box } = refs as any
                if (!flex || !box || !flex.current || !box.current) return
                const _flex = () => {
                        setErr('')
                        if (cache.err) setDisplay(true)
                }
                const _box = (e: Event) => e.stopPropagation()
                flex.current.addEventListener('click', _flex)
                box.current.addEventListener('click', _box)
                return () => {
                        if (!flex || !box || !flex.current || !box.current)
                                return
                        flex.current.removeEventListener('click', _flex)
                        box.current.removeEventListener('click', _box)
                }
        }, [])

        useEffect(() => {
                // @ts-ignore
                editorTree({
                        trySuccess() {
                                setErr((cache.err = ''))
                                setDisplay(false)
                        },
                        catchError(e: string) {
                                setErr((cache.err = e + ''))
                                setDisplay(false)
                        },
                })
        }, [self])

        const handleClickShowError = () => {
                setErr(cache.err)
                setDisplay(false)
        }

        return (
                <>
                        <Flex
                                display={err ? 'flex' : 'none'}
                                marginTop="25px"
                                position="absolute"
                                alignItems="start"
                                justifyContent="start"
                                backdropFilter="blur(1px)"
                                backgroundColor="rgba(0, 0, 0, 0.7)"
                                padding="1rem"
                                overflow="scroll"
                                color="white"
                                ref={refs('flex')}
                        >
                                <Box
                                        grow={0}
                                        shrink={0}
                                        height="3rem"
                                        fontSize="1.5rem"
                                        color="#E83A46"
                                >
                                        {getTitle(err)}
                                </Box>
                                <Box
                                        as="pre"
                                        grow={0}
                                        borderRadius="5px"
                                        padding="1rem"
                                        backdropFilter="blur(2px)"
                                        backgroundColor="rgba(255, 0, 0, 0.1)"
                                        overflow="visible"
                                        height="auto"
                                        width="auto"
                                        ref={refs('box')}
                                >
                                        <Box
                                                height="1.5rem"
                                                color="#E83A46"
                                                overflow="visible"
                                        >
                                                {getTitle(getText(err))}
                                        </Box>
                                        <Box minHeight="">
                                                {getText(getText(err))}
                                                {self.fs}
                                        </Box>
                                </Box>
                        </Flex>
                        <div
                                style={{
                                        display: display ? 'block' : 'none',
                                        position: 'absolute',
                                        left: '1.5rem',
                                        fontSize: '1.5rem',
                                        bottom: '1.5rem',
                                        borderRadius: '5px',
                                        padding: '0.1rem 1rem',
                                        backgroundColor: '#E83A46',
                                }}
                                onClick={handleClickShowError}
                        >
                                Show Error
                        </div>
                </>
        )
}

const getTitle = (err: string) => {
        return err.trim().split('\n').filter(Boolean)[0]
}

const getText = (err: string) => {
        return err.trim().split('\n').filter(Boolean).slice(1).join('\n')
}

const tmp = `
useViewport.ts:58 Could not compile glsl

ERROR: 0:32: 'asdf' : syntax error
`

const tmp_ = `
useViewport.ts:58 Could not compile glsl

ERROR: 0:32: 'asdf' : syntax error
    at Viewport (webpack-internal:///./ui/organisms/Viewport.tsx:13:30)
    at Tree (webpack-internal:///./ui/atoms/Tree.tsx:8:35)
    at div
    at eval (webpack-internal:///./ui/atoms/Box.tsx:7:94)
    at eval (webpack-internal:///./ui/molecules/Separate.tsx:15:1901)
    at div
    at eval (webpack-internal:///./ui/atoms/Flex.ts:7:95)
    at Separate (webpack-internal:///./ui/molecules/Separate.tsx:15:30)
    at Tree (webpack-internal:///./ui/atoms/Tree.tsx:8:35)
    at div
    at eval (webpack-internal:///./ui/atoms/Box.tsx:7:94)
    at eval (webpack-internal:///./ui/molecules/Separate.tsx:15:1901)
    at div
    at eval (webpack-internal:///./ui/atoms/Flex.ts:7:95)
    at Separate (webpack-internal:///./ui/molecules/Separate.tsx:15:30)
    at Tree (webpack-internal:///./ui/atoms/Tree.tsx:8:35)
    at div
    at eval (webpack-internal:///./ui/atoms/Flex.ts:7:95)
    at ErrorBoundary (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/exports/ErrorBoundary.js:16:269)
    at div
    at NavbarSecondaryMenuDisplayProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/navbarSecondaryMenu/display.js:21:318)
    at NavbarMobileSidebarProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/navbarMobileSidebar.js:23:414)
    at NavbarSecondaryMenuContentProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/navbarSecondaryMenu/content.js:16:157)
    at NavbarProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/utils/navbarUtils.js:22:29)
    at HtmlClassNameProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/utils/metadataUtils.js:29:46)
    at PluginHtmlClassNameProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/utils/metadataUtils.js:32:42)
    at DocsPreferredVersionContextProviderUnsafe (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/docsPreferredVersion.js:33:382)
    at DocsPreferredVersionContextProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/docsPreferredVersion.js:36:50)
    at ScrollControllerProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/utils/scrollUtils.js:21:489)
    at AnnouncementBarProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/announcementBar.js:25:450)
    at ColorModeProvider (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/contexts/colorMode.js:27:1246)
    at eval (webpack-internal:///../../node_modules/@docusaurus/theme-common/lib/utils/reactUtils.js:59:9)
    at LayoutProvider (webpack-internal:///../../node_modules/@docusaurus/theme-classic/lib/theme/Layout/Provider/index.js:20:646)
    at Layout (webpack-internal:///../../node_modules/@docusaurus/theme-classic/lib/theme/Layout/index.js:26:33)
    at Layout (webpack-internal:///./ui/templates/Layout.tsx:18:113)
    at Home
    at RouteContextProvider (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/routeContext.js:16:60)
    at LoadableComponent (webpack-internal:///../../node_modules/react-loadable/lib/index.js:138:32)
    at Route (webpack-internal:///../../node_modules/react-router/esm/react-router.js:648:29)
    at Switch (webpack-internal:///../../node_modules/react-router/esm/react-router.js:850:29)
    at Route (webpack-internal:///../../node_modules/react-router/esm/react-router.js:648:29)
    at ClientLifecyclesDispatcher (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/ClientLifecyclesDispatcher.js:15:261)
    at PendingNavigation (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/PendingNavigation.js:17:150)
    at Root (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/theme-fallback/Root/index.js:20:16)
    at BrowserContextProvider (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/browserContext.js:21:127)
    at DocusaurusContextProvider (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/docusaurusContext.js:21:496)
    at ErrorBoundary (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/exports/ErrorBoundary.js:16:269)
    at App (webpack-internal:///../../node_modules/@docusaurus/core/lib/client/App.js:28:241)
    at Router (webpack-internal:///../../node_modules/react-router/esm/react-router.js:267:30)
    at BrowserRouter (webpack-internal:///../../node_modules/react-router-dom/esm/react-router-dom.js:58:35)
    at r (webpack-internal:///../../node_modules/react-helmet-async/lib/index.module.js:17:7350)
overrideMethod @ console.js:213
eval @ useViewport.ts:58
commitHookEffectListMount @ react-dom.development.js:23150
commitPassiveMountOnFiber @ react-dom.development.js:24926
commitPassiveMountEffects_complete @ react-dom.development.js:24891
commitPassiveMountEffects_begin @ react-dom.development.js:24878
commitPassiveMountEffects @ react-dom.development.js:24866
flushPassiveEffectsImpl @ react-dom.development.js:27039
flushPassiveEffects @ react-dom.development.js:26984
commitRootImpl @ react-dom.development.js:26935
commitRoot @ react-dom.development.js:26682
performSyncWorkOnRoot @ react-dom.development.js:26117
flushSyncCallbacks @ react-dom.development.js:12042
eval @ react-dom.development.js:25651
Show 1 more frame
Show less
`.trim()
