import { Selector } from './baseTypes'
export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Source<T>
}
export interface Callbag<I, O> {
    (t: 0, d: Callbag<O, I>): void
    (t: 1, d: I): void
    (t: 2, d?: any): void
}
export declare type Source<T> = Callbag<void, T>
export declare type Sink<T> = Callbag<T, void>
export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}
export declare const observeFactory: (store: any) => ObserveFn
