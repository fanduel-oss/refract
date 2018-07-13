import { Observable } from 'rxjs'
import { Selector, ObserveOptions } from './baseTypes'
export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        options?: Partial<ObserveOptions>
    ): Observable<T>
}
export declare const observeFactory: (store: any) => ObserveFn
