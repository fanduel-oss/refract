import { COMPONENT_EFFECT } from './effects'
import {
    Listener,
    createComponent,
    Subscription,
    subscribeToSink,
    ObservableComponent,
    Aperture,
    createObservable
} from './observable'
import {
    createEventData,
    MOUNT_EVENT,
    UNMOUNT_EVENT,
    createPropsData
} from './data'
import { Handler, ErrorHandler, PushEvent } from './baseTypes'

export const configureHook = <Data, Effect>(
    aperture: Aperture<Data, Effect>,
    data: Data,
    handler: Handler<Data, Effect> = () => () => void 0,
    errorHandler?: ErrorHandler<Data>,
    hookName: string = 'unknown hook'
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

    const pushEvent = (eventName: string) => (val?: any) => {
        listeners.forEach(listener => {
            listener.next(createEventData(eventName, val))
        })
    }

    const dataObservable = createObservable((listener: Listener<any>) => {
        addListener(listener)

        listener.next(createPropsData(lastData))

        return { unsubscribe: () => removeListener(listener) }
    })

    const component: ObservableComponent = createComponent(
        propName => data[propName],
        dataObservable,
        pushEvent as PushEvent,
        false
    )

    const sinkObservable = aperture(component, data)

    if (!sinkObservable) {
        throw new Error(
            `Your Refract aperture didn't return an observable entity in ${hookName} (hook).`
        )
    }

    const sinkSubscription: Subscription = subscribeToSink<Effect>(
        sinkObservable,
        finalHandler(data),
        errorHandler ? errorHandler(data) : undefined
    )

    const pushMountEvent = () => {
        ;(pushEvent as PushEvent)(MOUNT_EVENT)()
    }

    const pushUnmountEvent = () => {
        ;(pushEvent as PushEvent)(UNMOUNT_EVENT)()
    }

    return {
        data: returnedData,
        unsubscribe: () => {
            pushUnmountEvent()
            sinkSubscription.unsubscribe()
        },
        pushMountEvent,
        pushData: (data: Data) => {
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
