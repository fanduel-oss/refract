import { Stream } from 'most'
import { Selector } from './baseTypes'
export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        withInitialValue?: boolean
    ): Stream<T>
}
export declare const observeFactory: (store: any) => ObserveFn
