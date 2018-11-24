import {
    Observable,
    PartialObserver as Listener,
    Subscription,
    from
} from 'rxjs'
import {
    filter,
    map,
    mapTo,
    distinctUntilChanged,
    startWith
} from 'rxjs/operators'
import { PushEvent, Handler, ErrorHandler } from './baseTypes'
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

export { Listener, Subscription }

export interface ObservableComponent {
    observe: <T>(
        propName?: string,
        valueTransformer?: (val: any) => T
    ) => Observable<T>
    fromEvent: <T>(
        eventName: string,
        valueTransformer?: (val: any) => T
    ) => Observable<T>
    mount: Observable<any>
    unmount: Observable<any>
    pushEvent: PushEvent
    useEvent: <T>(
        eventName: string,
        seedValue?: T
    ) => [Observable<T>, (val: T) => any]
}

export type Aperture<P, E, C = any> = (
    component: ObservableComponent,
    initialProps: P,
    initialContext?: C
) => Observable<E>

export const subscribeToSink = <T>(
    sink: Observable<T>,
    next: (val: T) => void,
    error?: (error: any) => void
): Subscription =>
    sink.subscribe({
        next,
        error
    })

export const createComponent = <P>(
    instance,
    dataObservable,
    pushEvent: PushEvent
): ObservableComponent => {
    const data = () => from<Data<P>>(dataObservable)
    const fromEvent = <T>(eventName, valueTransformer?) =>
        data().pipe(
            filter(isEvent(eventName)),
            map((data: EventData) => {
                const { value } = data.payload

                return valueTransformer ? valueTransformer(value) : value
            })
        )

    return {
        mount: data().pipe(filter(isEvent(MOUNT_EVENT)), mapTo(undefined)),
        unmount: data().pipe(filter(isEvent(UNMOUNT_EVENT)), mapTo(undefined)),
        observe: <T>(propName?, valueTransformer?) => {
            if (propName && typeof instance.props[propName] === 'function') {
                return data().pipe(
                    filter(isCallback(propName)),
                    map((data: CallbackData) => {
                        const { args } = data.payload
                        return valueTransformer
                            ? valueTransformer(args)
                            : args[0]
                    })
                )
            }

            if (propName) {
                return data().pipe(
                    filter(isProps),
                    map((data: PropsData<P>) => {
                        const prop = data.payload[propName]

                        return valueTransformer ? valueTransformer(prop) : prop
                    }),
                    distinctUntilChanged()
                )
            }

            return data().pipe(
                filter(isProps),
                map((data: PropsData<P>) => data.payload),
                distinctUntilChanged(shallowEquals)
            )
        },
        fromEvent,
        pushEvent,
        useEvent: <T>(eventName: string, seedValue?: T) => {
            const events$ = fromEvent(eventName)
            const pushEventValue = pushEvent(eventName) as (value: T) => void

            return [
                seedValue === undefined
                    ? events$
                    : events$.pipe(startWith(seedValue)),
                pushEventValue
            ]
        }
    }
}
