import { Observable, PartialObserver as Listener, Subscription } from 'rxjs'
export { Listener, Subscription }
export interface ObservableComponent {
    observe: <T>(propName: string) => Observable<T>
    mount: Observable<any>
    unmount: Observable<any>
}
export declare type EffectFactory<P, E> = (
    props: P
) => (component: ObservableComponent) => Observable<E>
export declare const subscribeToSink: <T>(
    sink: Observable<T>,
    next: (val: T) => void,
    error?: (error: any) => void
) => Subscription
export declare const createObservable: <T>(subscribe: any) => Observable<T>
