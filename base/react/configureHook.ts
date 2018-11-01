import $$observable from 'symbol-observable'
import { COMPONENT_EFFECT } from './effects'
import {
    Listener,
    createComponent,
    Subscription,
    subscribeToSink,
    ObservableComponent
} from './observable'
import {
    createEventData,
    MOUNT_EVENT,
    UNMOUNT_EVENT,
    createPropsData
} from './data'
import { PushEvent } from './baseTypes'

export const configureHook = <D, E, C>(
    handler,
    errorHandler,
    aperture,
    data: D,
    context: C
) => {
    let returnedData = {}
    let lastData = data
    let setComponentData

    const finalHandler = (initialData, initialContext) => {
        const effectHandler = handler(initialData, initialContext)

        return effect => {
            if (effect && effect.type === COMPONENT_EFFECT) {
                if (setComponentData) {
                    setComponentData(effect.payload)
                } else {
                    returnedData = effect.payload
                }
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

            listener.next(createPropsData(lastData))

            return { unsubscribe: () => removeListener(listener) }
        },
        [$$observable]() {
            return this
        }
    }

    const component: ObservableComponent = createComponent(
        propName => data[propName],
        dataObservable,
        pushEvent
    )

    const sinkObservable = aperture(data, context)(component)

    const sinkSubscription: Subscription = subscribeToSink<E>(
        sinkObservable,
        finalHandler(data, context),
        errorHandler ? errorHandler(data, context) : undefined
    )

    const pushMountEvent = () => {
        pushEvent(MOUNT_EVENT)(undefined)
    }

    const pushUnmountEvent = () => {
        pushEvent(UNMOUNT_EVENT)(undefined)
    }

    return {
        data: returnedData,
        unsubscribe: () => {
            pushUnmountEvent()
            sinkSubscription.unsubscribe()
        },
        pushMountEvent,
        pushData: (data: D) => {
            lastData = data

            listeners.forEach(listener => {
                listener.next(createPropsData(data))
            })
        },
        registerSetData: setData => {
            setComponentData = data => setData(hook => ({ ...hook, data }))
        }
    }
}
