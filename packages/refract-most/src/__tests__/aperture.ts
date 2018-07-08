import { merge } from 'most'

import { Aperture } from '../index'

export interface Effect {
    type: string
    value?: number
}

export interface Props {
    value: number
    setValue: (value: number) => void
}

const aperture: Aperture<Props, Effect> = props => component => {
    const value$ = component.observe<number>('value')
    const valueSet$ = component.observe<number>('setValue')
    const mount$ = component.mount
    const unmount$ = component.unmount

    return merge<Effect>(
        value$.map(value => ({
            type: 'ValueChange',
            value
        })),

        valueSet$.map(value => ({
            type: 'ValueSet',
            value
        })),

        mount$.constant({
            type: 'Start'
        }),

        unmount$.constant({
            type: 'Stop'
        })
    )
}

export default aperture
