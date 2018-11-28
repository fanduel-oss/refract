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

export { Listener, Subscription }

export interface UseEvent {
    (eventName: string): [Observable<void>, () => any]
    <T = any>(eventName: string, seedValue?: T): [
        Observable<T>,
        (val: T) => any
    ]
}

export interface FromEvent {
    (eventName: string): Observable<void>
    <T>(eventName: string, valueTransformer?: (val: any) => T): Observable<T>
}

export interface ObservableComponentBase {
    mount: Observable<any>
    unmount: Observable<any>
    fromEvent: FromEvent
    pushEvent: PushEvent
    useEvent: UseEvent
}

export interface Observe {
    observe: <T>(
        propName?: string,
        valueTransformer?: (val: any) => T
    ) => Observable<T>
}

export type ObservableComponent = Observe & ObservableComponentBase

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

const getComponentBase = (
    data: Observable<any>,
    pushEvent: PushEvent
): ObservableComponentBase => {
    const fromEvent = <T>(eventName, valueTransformer?) =>
        data.pipe(
            filter(isEvent(eventName)),
            map((data: EventData) => {
                const { value } = data.payload

                return valueTransformer ? valueTransformer(value) : value
            })
        )

    const useEvent = (...args) => {
        const eventName: string = args[0]
        const hasSeedValue = args.length > 1
        const seedValue = args[2]
        const events$ = fromEvent(eventName)
        const pushEventValue = pushEvent(eventName)

        return [
            !hasSeedValue ? events$ : events$.pipe(startWith(seedValue)),
            pushEventValue
        ]
    }

    return {
        mount: data.pipe(filter(isEvent(MOUNT_EVENT)), mapTo(undefined)),
        unmount: data.pipe(filter(isEvent(UNMOUNT_EVENT)), mapTo(undefined)),
        fromEvent,
        pushEvent,
        useEvent: useEvent as UseEvent
    }
}

export const getObserve = <P>(getProp, data, decoratedProps) => {
    return function observe<T>(propName?, valueTransformer?) {
        if (
            decoratedProps &&
            propName &&
            typeof getProp(propName) === 'function'
        ) {
            return data().pipe(
                filter(isCallback(propName)),
                map((data: CallbackData) => {
                    const { args } = data.payload
                    return valueTransformer ? valueTransformer(args) : args[0]
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
    }
}

export const createComponent = <P>(
    getProp,
    dataObservable,
    pushEvent: PushEvent,
    decoratedProps: boolean
): ObservableComponent => {
    const data = () => from<Data<P>>(dataObservable)

    return {
        observe: getObserve(getProp, data, decoratedProps),
        ...getComponentBase(data(), pushEvent)
    }
}
