export interface Listener<T> {
    next: (value?: T) => void
    error?: (err: any) => void
    complete?: (value?: T) => void
}

export interface Subscription {
    unsubscribe: () => void
}

export interface PropListeners {
    [key: string]: Array<Listener<any>>
}

export interface Listeners {
    mount: Array<Listener<any>>
    unmount: Array<Listener<any>>
    props: PropListeners
}

export type EffectHandler<P, E> = (props: P) => (val: E) => void
