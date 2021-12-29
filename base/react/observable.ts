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
    <Type = any>(eventName: string, seedValue?: Type): [
        Observable<Type>,
        (val: Type) => any
    ]
}

export interface FromEvent {
    (eventName: string): Observable<void>
    <Type>(
        eventName: string,
        valueTransformer?: (val: any) => Type
    ): Observable<Type>
}

export interface ObservableComponentBase {
    mount: Observable<any>
    unmount: Observable<any>
    fromEvent: FromEvent
    pushEvent: PushEvent
    useEvent: UseEvent
}

export interface Observe {
    observe: <Type>(
        propName?: string,
        valueTransformer?: (val: any) => Type
    ) => Observable<Type>
}

export type ObservableComponent = Observe & ObservableComponentBase

export type Aperture<Props, Effect, Context = any> = (
    component: ObservableComponent,
    initialProps: Props,
    initialContext?: Context
) => Observable<Effect>

export const subscribeToSink = <Type>(
    sink: Observable<Type>,
    next: (val: Type) => void,
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

    function useEvent(eventName: string, seedValue?: any) {
        const hasSeedValue = arguments.length > 1
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

export const createObservable = subscribe => new Observable(subscribe)

export const getObserve = <Props>(getProp, data, decoratedProps) => {
    return function observe<Type>(propName?, valueTransformer?) {
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
                map((data: PropsData<Props>) => {
                    const prop = data.payload[propName]

                    return valueTransformer ? valueTransformer(prop) : prop
                }),
                distinctUntilChanged()
            )
        }

        return data().pipe(
            filter(isProps),
            map((data: PropsData<Props>) => data.payload),
            distinctUntilChanged(shallowEquals)
        )
    }
}

export const createComponent = <Props>(
    getProp,
    dataObservable,
    pushEvent: PushEvent,
    decoratedProps: boolean
): ObservableComponent => {
    const data = () => from<Data<Props>>(dataObservable)

    return {
        observe: getObserve(getProp, data, decoratedProps),
        ...getComponentBase(data(), pushEvent)
    }
}
