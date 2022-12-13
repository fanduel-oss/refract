import {
    Action,
    AnyAction,
    // @ts-ignore
    ConfigureStoreOptions,
    // @ts-ignore
    EnhancedStore,
    Middleware,
    configureStore
} from '@reduxjs/toolkit'
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'
import { observeFactory, StoreObserveFunction } from './observable'
import { AddActionListener, ActionListener } from './baseTypes'

export type UnsubscribeFn = () => void

export type Selector<Type> = (state: object) => Type

export type Middlewares<S> = ReadonlyArray<Middleware<{}, S>>

export interface RefractEnhancedStore<
    S = any,
    A extends Action = AnyAction,
    M extends Middlewares<S> = Middlewares<S>
> extends EnhancedStore<S, A, M> {
    addActionListener: AddActionListener
    observe: StoreObserveFunction
}

const eventsPrefix = '@@event/'

// much of this is just copied from `./refractEnhancer`
export function configureRefractStore<
    S = any,
    A extends Action = AnyAction,
    M extends Middlewares<S> = [ThunkMiddlewareFor<S>]
>(options: ConfigureStoreOptions<S, A, M>): RefractEnhancedStore<S, A, M> {
    const store = configureStore(options) as RefractEnhancedStore<S, A, M>

    const actionListeners: Record<string, ActionListener[]> = {}

    // @ts-ignore
    const dispatch = store.dispatch

    const newDispatch = (action: A) => {
        let result
        const hasType = action && action.type
        const isEvent = hasType && action.type.indexOf(eventsPrefix) === 0

        if (!isEvent) {
            result = dispatch(action)
        }

        if (hasType && actionListeners[action.type]) {
            actionListeners[action.type].forEach(listener => listener(action))
        }

        return result
    }

    // @ts-ignore
    store.dispatch = newDispatch as any

    // @ts-ignore
    store.addActionListener = (
        actionType: string,
        listener: ActionListener
    ) => {
        actionListeners[actionType] = (
            actionListeners[actionType] || []
        ).concat(listener)

        return () => {
            actionListeners[actionType] = actionListeners[actionType].filter(
                l => listener !== l
            )
        }
    }

    // @ts-ignore
    store.observe = observeFactory(store)

    return store
}
