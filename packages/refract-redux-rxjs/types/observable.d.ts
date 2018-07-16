import { Observable } from 'rxjs'
import { Selector } from './baseTypes'
export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Observable<T>
}
export declare const observeFactory: (store: any) => ObserveFn
