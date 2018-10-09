export type Handler<P, E> = (intialProps: P) => (val: E) => void

export type ErrorHandler<P> = (intialProps: P) => (error: any) => void

export type PushEvent = (eventName: string) => <T>(val: T) => void
