import { Stream } from 'most'
import { Selector, ObserveOptions } from './baseTypes'
export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        options?: Partial<ObserveOptions>
    ): Stream<T>
}
export declare const observeFactory: (store: any) => ObserveFn
