import { Listener } from './observable'

type ListenerAndTransformer<T> = [Partial<Listener<T>>, (value: any) => T]

export interface KeyedListenersAndTransformers {
    [key: string]: Array<ListenerAndTransformer<any>>
}

export interface Listeners {
    allProps: Array<Partial<Listener<any>>>
    props: KeyedListenersAndTransformers
    fnProps: KeyedListenersAndTransformers
    event: KeyedListenersAndTransformers
}

export type Handler<P, E> = (intialProps: P) => (val: E) => void

export type ErrorHandler<P> = (intialProps: P) => (error: any) => void

export type PushEvent = (eventName: string) => <T>(val: T) => void
