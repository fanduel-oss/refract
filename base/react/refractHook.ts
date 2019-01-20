// @ts-ignore
import { useState, useLayoutEffect, useEffect, useMemo } from 'react'
import { configureHook } from './configureHook'
import { Aperture } from './observable'
import { Handler, ErrorHandler } from './baseTypes'

export interface Config<Data, Effect> {
    handler?: Handler<Data, Effect>
    errorHandler?: ErrorHandler<Data>
}

export const useRefract = <Data, CurrentData = any, Effect = any>(
    aperture: Aperture<Data, Effect>,
    data: Data,
    config: Config<Data, Effect> = {}
): CurrentData => {
    const initialHook = useMemo(
        () =>
            configureHook<Data, Effect>(
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

    return hook.data as CurrentData
}
