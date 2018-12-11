export const MOUNT_EVENT: string = '@@refract/event/mount'
export const UNMOUNT_EVENT: string = '@@refract/event/unmount'

export enum DataType {
    EVENT = 'event',
    PROPS = 'props',
    CALLBACK = 'callback'
}

export type Data<P> = PropsData<P> | CallbackData | EventData

export interface PropsData<P> {
    type: DataType
    payload: Partial<P>
}

export interface CallbackData {
    type: DataType
    payload: {
        name: string
        args: any[]
    }
}

export interface EventData {
    type: DataType
    payload: {
        name: string
        value?: any
    }
}

export const isEvent = <P>(eventName) => (data: Data<P>, index?) =>
    data.type === DataType.EVENT &&
    (data as EventData).payload.name === eventName

export const isProps = <P>(data: Data<P>) => data.type === DataType.PROPS

export const isCallback = <P>(propName) => (data: Data<P>) =>
    data.type === DataType.CALLBACK &&
    (data as CallbackData).payload.name === propName

export const createEventData = (name: string, value?: any): EventData => ({
    type: DataType.EVENT,
    payload: {
        name,
        value
    }
})

export const createPropsData = <P>(props: P): PropsData<P> => ({
    type: DataType.PROPS,
    payload: props
})

export const createCallbackData = (
    name: string,
    args: any[]
): CallbackData => ({
    type: DataType.CALLBACK,
    payload: {
        name,
        args
    }
})

export const shallowEquals = (left, right) =>
    left === right ||
    (Object.keys(left).length === Object.keys(right).length &&
        Object.keys(left).every(leftKey => left[leftKey] === right[leftKey]))

export const createObservable = subscribe => {
    const observable = {
        subscribe,
        ['@@observable']() {
            return this
        }
    }

    // @ts-ignore
    if (typeof Symbol === 'function' && Symbol.observable) {
        // @ts-ignore
        observable[Symbol.observable] = () => observable
    }

    return observable
}
