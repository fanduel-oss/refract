import xs from 'xstream'
import { Aperture } from '../../../../packages/refract-xstream/src'

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
    const linkClick$ = component.event<any>('linkClick')

    return xs.merge<Effect>(
        value$.map(value => ({
            type: 'ValueChange',
            value
        })),

        valueSet$.map(value => ({
            type: 'ValueSet',
            value
        })),

        mount$.mapTo({
            type: 'Start'
        }),

        unmount$.mapTo({
            type: 'Stop'
        }),

        linkClick$.mapTo({
            type: 'LinkClick'
        })
    )
}

export default aperture
