export const MOUNT_EVENT: string = '@@refract/event/mount'
export const UNMOUNT_EVENT: string = '@@refract/event/unmount'

enum DataType {
    EVENT = 'event',
    PROPS = 'props',
    CALLBACK = 'callback'
}

export interface Data {
    type: DataType
    payload: any
}

export const isEvent = eventName => data =>
    data.type === DataType.EVENT && data.payload.name === eventName
export const isProps = data => data.type === DataType.PROPS
export const isCallback = propName => data =>
    data.type === DataType.CALLBACK && data.payload.name === propName

export const createEventData = (name, value) => ({
    type: DataType.EVENT,
    payload: {
        name,
        value
    }
})

export const createPropsData = <P>(props: P) => ({
    type: DataType.PROPS,
    payload: props
})

export const createCallbackData = (name, args: any[]) => ({
    type: DataType.CALLBACK,
    payload: {
        name,
        args
    }
})
