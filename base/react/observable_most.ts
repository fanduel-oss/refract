import { from, Stream, Subscriber as Listener } from 'most'
import { PushEvent } from './baseTypes'
import {
    isEvent,
    MOUNT_EVENT,
    UNMOUNT_EVENT,
    isProps,
    isCallback,
    Data,
    PropsData,
    EventData,
    CallbackData,
    shallowEquals
} from './data'

export { Listener }

export interface ObservableComponent {
    observe: <T>(
        propName?: string,
        valueTransformer?: (val: any) => T
    ) => Stream<T>
    event: <T>(
        eventName: string,
        valueTransformer?: (val: any) => T
    ) => Stream<T>
    mount: Stream<any>
    unmount: Stream<any>
    pushEvent: PushEvent
}

export interface Subscription {
    unsubscribe(): void
}

export type Aperture<P, E> = (
    props: P
) => (component: ObservableComponent) => Stream<E>

export const subscribeToSink = <T>(
    sink: Stream<T>,
    next: (val: T) => void,
    error?: (error: any) => void
): Subscription =>
    sink.subscribe({
        next,
        error,
        complete: () => void 0
    })

export const createComponent = <P>(
    instance,
    dataObservable,
    pushEvent
): ObservableComponent => {
    const data$ = from<Data<P>>(dataObservable)

    return {
        mount: data$.filter(isEvent(MOUNT_EVENT)).map(() => undefined),
        unmount: data$.filter(isEvent(UNMOUNT_EVENT)).map(() => undefined),
        observe: <T>(propName?, valueTransformer?) => {
            if (propName && typeof instance.props[propName] === 'function') {
                return data$
                    .filter(isCallback(propName))
                    .map((data: CallbackData) => {
                        const { args } = data.payload
                        return valueTransformer
                            ? valueTransformer(args)
                            : args[0]
                    })
            }

            if (propName) {
                return data$
                    .filter(isProps)
                    .map((data: PropsData<P>) => {
                        const prop = data.payload[propName]

                        return valueTransformer ? valueTransformer(prop) : prop
                    })
                    .skipRepeats()
            }

            return data$
                .filter(isProps)
                .map((data: PropsData<P>) => data.payload)
                .skipRepeatsWith(shallowEquals)
        },
        event: <T>(eventName, valueTransformer?) =>
            data$.filter(isEvent(eventName)).map((data: EventData) => {
                const { value } = data.payload

                return valueTransformer ? valueTransformer(value) : value
            }),
        pushEvent
    }
}
