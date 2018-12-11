import $$observable from 'symbol-observable'
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

export interface UseEvent {
    (eventName: string): [Stream<void>, () => any]
    <T = any>(eventName: string, seedValue?: T): [Stream<T>, (val: T) => any]
}

export interface FromEvent {
    (eventName: string): Stream<void>
    <T>(eventName: string, valueTransformer?: (val: any) => T): Stream<T>
}

export interface ObservableComponentBase {
    mount: Stream<any>
    unmount: Stream<any>
    fromEvent: FromEvent
    pushEvent: PushEvent
    useEvent: UseEvent
}

export interface Observe {
    observe: <T>(
        propName?: string,
        valueTransformer?: (val: any) => T
    ) => Stream<T>
}

export type ObservableComponent = Observe & ObservableComponentBase

export interface Subscription {
    unsubscribe(): void
}

export type Aperture<P, E, C = any> = (
    component: ObservableComponent,
    initialProps: P,
    initialContext?: C
) => Stream<E>

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

const getComponentBase = (
    data: Stream<any>,
    pushEvent: PushEvent
): ObservableComponentBase => {
    const fromEvent = (eventName, valueTransformer?) =>
        data.filter(isEvent(eventName)).map((data: EventData) => {
            const { value } = data.payload

            return valueTransformer ? valueTransformer(value) : value
        })

    const useEvent = (...args) => {
        const eventName: string = args[0]
        const hasSeedValue = args.length > 1
        const seedValue = args[2]
        const events$ = fromEvent(eventName)
        const pushEventValue = pushEvent(eventName)

        return [
            !hasSeedValue ? events$ : events$.startWith(seedValue),
            pushEventValue
        ]
    }

    return {
        mount: data.filter(isEvent(MOUNT_EVENT)).constant(undefined),
        unmount: data.filter(isEvent(UNMOUNT_EVENT)).constant(undefined),
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
            return data()
                .filter(isCallback(propName))
                .map((data: CallbackData) => {
                    const { args } = data.payload
                    return valueTransformer ? valueTransformer(args) : args[0]
                })
        }

        if (propName) {
            return data()
                .filter(isProps)
                .map((data: PropsData<P>) => {
                    const prop = data.payload[propName]

                    return valueTransformer ? valueTransformer(prop) : prop
                })
                .skipRepeats()
        }

        return data()
            .filter(isProps)
            .map((data: PropsData<P>) => data.payload)
            .skipRepeatsWith(shallowEquals)
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

export const createObservable = subscribe => ({
    subscribe,
    [$$observable]() {
        return this
    }
})
