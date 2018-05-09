import { Observable, Observer } from 'rxjs'
import { Listener } from './baseTypes'

export interface ObservableComponent {
    observe: <T>(propName: string) => Observable<T>
    mount: Observable<any>
    unmount: Observable<any>
}

export type EffectFactory<P, E> = (props: P) => (component: ObservableComponent) => Observable<E>

export const toSubscribable = <T>(sink: Observable<T>) => sink

export const createObservable = <T>(subscribe): Observable<T> => Observable.create(
    (Listener: Listener<T>) => {
        const unsubscribe = subscribe(Listener)

        return unsubscribe
    }
)
