export type Handler<Props, Effect, Context = any> = (
    intialProps: Props,
    initialContext?: Context
) => (val: Effect) => void

export type ErrorHandler<Props, Context = any> = (
    intialProps: Props,
    initialContext?: Context
) => (error: any) => void

export interface PushEvent {
    (eventName: string): (val?: any) => void
    <Event = any>(eventName: string): (val: Event) => void
}
