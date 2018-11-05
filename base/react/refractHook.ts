// @ts-ignore
import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { configureHook } from './configureHook'
import { Aperture } from './observable'
import { Handler, ErrorHandler } from './baseTypes'

export const createRefractHook = <D, CD, E, C = {}>(
    handler: Handler<D, E, C>,
    errorHandler: ErrorHandler<D, C>,
    DependencyContext: React.Context<C> = React.createContext({} as C)
) => {
    const useRefract = (aperture: Aperture<D, E, C>, data: D): CD => {
        const dependencies = useContext(DependencyContext) as C
        const [hook, setData] = useState(
            configureHook<D, E, C>(
                handler,
                errorHandler,
                aperture,
                data,
                dependencies
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

        return hook.data
    }

    return useRefract
}
