// @ts-ignore
import React, { useState, useContext, useLayoutEffect } from 'react'
import { configureHook } from './configureHook'

const EmptyContext = React.createContext({})

export const createRefractHook = <P, C = {}>(
    handler,
    errorHandler,
    DependencyContext = EmptyContext
) => {
    const useRefract = (aperture, initialProps) => {
        const dependencies = useContext(DependencyContext) as C
        const [hook, setData] = useState(
            configureHook<P, C>(
                handler,
                errorHandler,
                aperture,
                initialProps,
                dependencies
            )
        )

        useLayoutEffect(() => {
            hook.registerSetData(setData)
            hook.pushMountEvent()

            return () => hook.unsubscribe()
        }, [])

        return hook.data
    }

    return useRefract
}
