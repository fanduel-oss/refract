export type Handler<Props, Effect, Context = any> = (
    intialProps: Props,
    initialContext?: Context
) => (val: Effect) => void

export type ErrorHandler<Props, Context = any> = (
    intialProps: Props,
    initialContext?: Context
) => (error: any) => void

export type PushEvent<T = unknown> = (eventName: string) => PushEventData<T>

export type PushEventData<T = unknown> = (val: T) => void