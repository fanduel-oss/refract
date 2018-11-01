// @ts-ignore
import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { configureHook } from './configureHook'

const EmptyContext = React.createContext({})

export const createRefractHook = <D, E, C = {}>(
    handler,
    errorHandler,
    DependencyContext = EmptyContext
) => {
    const useRefract = (aperture, data) => {
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
