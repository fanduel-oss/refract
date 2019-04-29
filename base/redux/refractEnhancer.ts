import {
    StoreEnhancer,
    Reducer,
    StoreCreator,
    Store,
    AnyAction,
    Action as ReduxAction
} from 'redux'

import { observeFactory, StoreObserveFunction } from './observable'
import { AddActionListener, ActionListener, EnhancerOptions } from './baseTypes'

declare module 'redux' {
    interface Store {
        addActionListener: AddActionListener
        observe: StoreObserveFunction
    }
}

interface ActionListeners {
    [key: string]: ActionListener[]
}

const defaultOptions: EnhancerOptions = {
    eventsPrefix: '@@event/',
    methodName: 'observe'
}

export default function refractStoreEnhancer<
    State = any,
    Action extends ReduxAction<any> = AnyAction
>(options: Partial<EnhancerOptions> = {}): StoreEnhancer {
    const opts: EnhancerOptions = { ...defaultOptions, ...options }

    return (createStore: StoreCreator): StoreCreator => (
        reducer: Reducer,
        initialState: {},
        enhancer?: StoreEnhancer
    ): Store<State, Action> => {
        const actionListeners: ActionListeners = {}
        const store = createStore(reducer, initialState, enhancer)
        const dispatch = store.dispatch

        store.dispatch = action => {
            let result
            const hasType = action && action.type
            const isEvent =
                opts.eventsPrefix &&
                hasType &&
                action.type.indexOf(opts.eventsPrefix) === 0

            if (!isEvent) {
                result = dispatch(action)
            }

            if (hasType && actionListeners[action.type]) {
                actionListeners[action.type].forEach(listener =>
                    listener(action)
                )
            }

            return result
        }

        store.addActionListener = (
            actionType: string,
            listener: ActionListener
        ) => {
            actionListeners[actionType] = (
                actionListeners[actionType] || []
            ).concat(listener)

            return () => {
                actionListeners[actionType] = actionListeners[
                    actionType
                ].filter(l => listener !== l)
            }
        }

        store[opts.methodName] = observeFactory(store)

        return store as Store<State, Action>
    }
}
