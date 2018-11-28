export type Handler<P, E, C = any> = (
    intialProps: P,
    initialContext?: C
) => (val: E) => void

export type ErrorHandler<P, C = any> = (
    intialProps: P,
    initialContext?: C
) => (error: any) => void

export interface PushEvent {
    (eventName: string): () => void
    <T = any>(eventName: string): (val: T) => void
}
