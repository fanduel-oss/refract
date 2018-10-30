// @ts-ignore
import React, { useState, useContext, useEffect } from 'react'
import { configureHook } from './configureHook'

const EmptyContext = React.createContext({})

export const createRefractHook = <P, C = {}>(
    handler,
    errorHandler,
    DependencyContext = EmptyContext
) => {
    const useRefract = (aperture, initialProps) => {
        const [data, setData] = useState({})

        const dependencies = useContext(DependencyContext) as C

        useEffect(() => {
            const unsubscribe = configureHook<P, C>(
                handler,
                errorHandler,
                aperture,
                setData,
                initialProps,
                dependencies
            )

            return unsubscribe
        }, [])

        return data
    }

    return useRefract
}
