import xs, { Stream, Listener, Subscription } from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { PushEvent } from './baseTypes'
import {
    isEvent,
    MOUNT_EVENT,
    UNMOUNT_EVENT,
    isProps,
    isCallback,
    Data
} from './data'

export { Listener, Subscription }

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

export const createComponent = (
    instance,
    dataObservable,
    pushEvent
): ObservableComponent => {
    const data$ = xs.from<Data>(dataObservable)

    return {
        mount: data$.filter(isEvent(MOUNT_EVENT)).mapTo(undefined),
        unmount: data$.filter(isEvent(UNMOUNT_EVENT)).mapTo(undefined),
        observe: <T>(propName?, valueTransformer?) => {
            if (propName && typeof instance.props[propName] === 'function') {
                return data$.filter(isCallback(propName)).map(data => {
                    const { args } = data.payload
                    return valueTransformer ? valueTransformer(args) : args[0]
                })
            }

            if (propName) {
                return data$
                    .filter(isProps)
                    .map(data => {
                        const prop = data.payload[propName]

                        return valueTransformer ? valueTransformer(prop) : prop
                    })
                    .compose(dropRepeats())
            }

            return data$
                .filter(isProps)
                .map(data => data.payload)
                .compose(dropRepeats())
        },
        event: <T>(eventName, valueTransformer?) =>
            data$.filter(isEvent(eventName)).map(data => {
                const { value } = data.payload

                return valueTransformer ? valueTransformer(value) : value
            }),
        pushEvent
    }
}
