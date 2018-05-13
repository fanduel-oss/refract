import { observe } from './observable'

export interface EnhancerOptions {
    eventsPrefix: string
}

type ActionListener = (action: object) => void

interface ActionListeners {
    [key: string]: ActionListener[]
}

const defaultOptions: EnhancerOptions = {
    eventsPrefix: '@@event/'
}

export default function reactiveReduxStoreEnhancer(
    options: Partial<EnhancerOptions> = {}
) {
    const opts: EnhancerOptions = { ...defaultOptions, ...options }

    return createStore => (reducer, initialState, enhancer) => {
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

        store.observe = observe(store)

        return store
    }
}
