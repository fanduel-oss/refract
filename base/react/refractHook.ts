// @ts-ignore
import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { configureHook } from './configureHook'
import { Aperture } from './observable'
import { Handler, ErrorHandler } from './baseTypes'

export interface Config<D, E, C = any> {
    handler: Handler<D, E, C>
    errorHandler: ErrorHandler<D, C>
    Context: React.Context<C>
}

export const useRefract = <D, CD = any, E = any, C = any>(
    aperture: Aperture<D, E, C>,
    data: D,
    config: Partial<Config<D, E, C>> = {}
): CD => {
    const DependencyContext = config.Context || React.createContext({} as C)
    const dependencies = useContext(DependencyContext) as C
    const [hook, setData] = useState(
        configureHook<D, E, C>(
            aperture,
            data,
            dependencies,
            config.handler,
            config.errorHandler
        )
    )

    useLayoutEffect(() => {
        hook.registerSetData(setData)
        hook.pushMountEvent()

        return () => hook.unsubscribe()
    }, [])

    useEffect(() => {
        hook.pushData(data)
    })

    return hook.data as CD
}
