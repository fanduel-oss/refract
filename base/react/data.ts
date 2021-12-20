export const MOUNT_EVENT: string = '@@refract/event/mount'
export const UNMOUNT_EVENT: string = '@@refract/event/unmount'

export enum DataType {
    EVENT = 'event',
    PROPS = 'props',
    CALLBACK = 'callback'
}

export type Data<Props> = PropsData<Props> | CallbackData | EventData

export interface PropsData<Props> {
    type: DataType
    payload: Partial<Props>
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

export const isEvent = <Props>(eventName) => (data: Data<Props>) =>
    data.type === DataType.EVENT &&
    (data as EventData).payload.name === eventName

export const isProps = <Props>(data: Data<Props>) =>
    data.type === DataType.PROPS

export const isCallback = <Props>(propName) => (data: Data<Props>) =>
    data.type === DataType.CALLBACK &&
    (data as CallbackData).payload.name === propName

export const createEventData = (name: string, value?: any): EventData => ({
    type: DataType.EVENT,
    payload: {
        name,
        value
    }
})

export const createPropsData = <Props>(props: Props): PropsData<Props> => ({
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
