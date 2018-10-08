import {
    Observable,
    PartialObserver as Listener,
    Subscription,
    from
} from 'rxjs'
import { filter, map, mapTo, distinctUntilChanged } from 'rxjs/operators'
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
    ) => Observable<T>
    event: <T>(
        eventName: string,
        valueTransformer?: (val: any) => T
    ) => Observable<T>
    mount: Observable<any>
    unmount: Observable<any>
    pushEvent: PushEvent
}

export type Aperture<P, E> = (
    initialProps: P
) => (component: ObservableComponent) => Observable<E>

export const subscribeToSink = <T>(
    sink: Observable<T>,
    next: (val: T) => void,
    error?: (error: any) => void
): Subscription =>
    sink.subscribe({
        next,
        error
    })

export const createComponent = (
    instance,
    dataObservable,
    pushEvent
): ObservableComponent => {
    const data$ = from<Data>(dataObservable)

    return {
        mount: data$.pipe(filter(isEvent(MOUNT_EVENT)), mapTo(undefined)),
        unmount: data$.pipe(filter(isEvent(UNMOUNT_EVENT)), mapTo(undefined)),
        observe: <T>(propName?, valueTransformer?) => {
            if (propName && typeof instance.props[propName] === 'function') {
                return data$.pipe(
                    filter(isCallback(propName)),
                    map(data => {
                        const { args } = data.payload
                        return valueTransformer
                            ? valueTransformer(args)
                            : args[0]
                    })
                )
            }

            if (propName) {
                return data$.pipe(
                    filter(isProps),
                    map(data => {
                        const prop = data.payload[propName]

                        return valueTransformer ? valueTransformer(prop) : prop
                    }),
                    distinctUntilChanged()
                )
            }

            return data$.pipe(
                filter(isProps),
                map(data => data.payload),
                distinctUntilChanged()
            )
        },
        event: <T>(eventName, valueTransformer?) =>
            data$.pipe(
                filter(isEvent(eventName)),
                map(data => {
                    const { value } = data.payload

                    return valueTransformer ? valueTransformer(value) : value
                })
            ),
        pushEvent
    }
}
