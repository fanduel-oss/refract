import { Listener } from './observable'
export interface KeyedListeners {
    [key: string]: Array<Partial<Listener<any>>>
}
export interface Listeners {
    mount: Array<Partial<Listener<any>>>
    unmount: Array<Partial<Listener<any>>>
    allProps: Array<Partial<Listener<any>>>
    props: KeyedListeners
    fnProps: KeyedListeners
    event: KeyedListeners
}
export declare type Handler<P, E> = (intialProps: P) => (val: E) => void
export declare type ErrorHandler<P> = (intialProps: P) => (error: any) => void
export declare type PushEvent = (eventName: string) => <T>(val: T) => void
