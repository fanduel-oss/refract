// @ts-ignore
import { useState, useLayoutEffect, useEffect, useMemo } from 'react'
import { configureHook } from './configureHook'
import { Aperture } from './observable'
import { Handler, ErrorHandler } from './baseTypes'

export interface Config<D, E> {
    handler?: Handler<D, E>
    errorHandler?: ErrorHandler<D>
}

export const useRefract = <D, CD = any, E = any>(
    aperture: Aperture<D, E>,
    data: D,
    config: Config<D, E> = {}
): CD => {
    const initialHook = useMemo(
        () =>
            configureHook<D, E>(
                aperture,
                data,
                config.handler,
                config.errorHandler
            ),
        []
    )

    const [hook, setData] = useState(initialHook)

    useLayoutEffect(() => {
        hook.registerSetData(setData)
        hook.pushMountEvent()

        return () => hook.unsubscribe()
    }, [])

    useEffect(
        () => {
            hook.pushData(data)
        },
        [data]
    )

    return hook.data as CD
}
