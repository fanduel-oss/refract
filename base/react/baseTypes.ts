export type Handler<P, E, C = any> = (
    intialProps: P,
    initialContext?: C
) => (val: E) => void

export type ErrorHandler<P, C = any> = (
    intialProps: P,
    initialContext?: C
) => (error: any) => void

export type PushEvent = (eventName: string) => <T>(val: T) => void
