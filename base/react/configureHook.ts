import $$observable from 'symbol-observable'
import { COMPONENT_EFFECT } from './effects'
import {
    Listener,
    createBaseComponent,
    Subscription,
    subscribeToSink,
    ObservableComponentBase
} from './observable'
import { createEventData, MOUNT_EVENT, UNMOUNT_EVENT } from './data'
import { PushEvent } from './baseTypes'

export const configureHook = <E, C>(
    handler,
    errorHandler,
    aperture,
    props,
    context: C
) => {
    let data = {}
    let setComponentData

    const finalHandler = (initialProps, initialContext) => {
        const effectHandler = handler(initialProps, initialContext)

        return effect => {
            if (effect && effect.type === COMPONENT_EFFECT) {
                if (setComponentData) {
                    setComponentData(effect.payload)
                } else {
                    data = effect.payload
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

            return { unsubscribe: () => removeListener(listener) }
        },
        [$$observable]() {
            return this
        }
    }

    const component: ObservableComponentBase = createBaseComponent(
        dataObservable,
        pushEvent
    )

    const sinkObservable = aperture(props, context)(component)

    const sinkSubscription: Subscription = subscribeToSink<E>(
        sinkObservable,
        finalHandler(props, context),
        errorHandler ? errorHandler(props, context) : undefined
    )

    const pushMountEvent = () => {
        pushEvent(MOUNT_EVENT)(undefined)
    }

    const pushUnmountEvent = () => {
        pushEvent(UNMOUNT_EVENT)(undefined)
    }

    return {
        data,
        unsubscribe: () => {
            pushUnmountEvent()
            sinkSubscription.unsubscribe()
        },
        pushMountEvent,
        registerSetData: setData => {
            setComponentData = data => setData({ data })
        }
    }
}
