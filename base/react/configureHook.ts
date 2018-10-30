import $$observable from 'symbol-observable'
import { COMPONENT_EFFECT } from './effects'
import {
    Listener,
    createEventBus,
    Subscription,
    subscribeToSink,
    EventBus
} from './observable'
import { createEventData } from './data'
import { PushEvent } from './baseTypes'

export const configureHook = <E, Ctx>(
    handler,
    errorHandler,
    aperture,
    setComponentData,
    props,
    context: Ctx
) => {
    const finalHandler = (initialProps, initialContext) => {
        const effectHandler = handler(initialProps, initialContext)

        return effect => {
            if (effect && effect.type === COMPONENT_EFFECT) {
                setComponentData(effect.payload)
            } else {
                effectHandler(effect)
            }
        }
    }

    let listeners: Array<Listener<any>> = []

    const addListener = listener => {
        listeners = listeners.concat(listener)
    }
    const removeListener = listener => {
        listeners = listeners.filter(l => l !== listener)
    }

    const pushEvent: PushEvent = (eventName: string) => <T>(val: T) => {
        listeners.forEach(listener => {
            listener.next(createEventData(eventName, val))
        })
    }

    const dataObservable = {
        subscribe(listener: Listener<any>) {
            addListener(listener)

            return { unsubscribe: () => removeListener(listener) }
        },
        [$$observable]() {
            return this
        }
    }

    const eventBus: EventBus = createEventBus(dataObservable, pushEvent)

    const sinkObservable = aperture(props, context)(eventBus)

    const sinkSubscription: Subscription = subscribeToSink<E>(
        sinkObservable,
        finalHandler(props, context),
        errorHandler ? errorHandler(props, context) : undefined
    )

    return () => sinkSubscription.unsubscribe()
}
