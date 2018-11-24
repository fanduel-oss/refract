import $$observable from 'symbol-observable'
import { COMPONENT_EFFECT } from './effects'
import {
    Listener,
    createComponent,
    Subscription,
    subscribeToSink,
    ObservableComponent,
    Aperture
} from './observable'
import {
    createEventData,
    MOUNT_EVENT,
    UNMOUNT_EVENT,
    createPropsData
} from './data'
import { Handler, ErrorHandler, PushEvent } from './baseTypes'

export const configureHook = <D, E>(
    aperture: Aperture<D, E>,
    data: D,
    handler: Handler<D, E> = () => () => void 0,
    errorHandler?: ErrorHandler<D>
) => {
    let returnedData
    let lastData = data
    let setComponentData

    const finalHandler = initialData => {
        const effectHandler = handler(initialData)

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

    const sinkObservable = aperture(component, data)

    const sinkSubscription: Subscription = subscribeToSink<E>(
        sinkObservable,
        finalHandler(data),
        errorHandler ? errorHandler(data) : undefined
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
