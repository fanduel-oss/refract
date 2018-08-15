import { merge, map } from 'callbag-basics'

import { Aperture } from '../../../../packages/refract-callbag/src'

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

    return merge(
        map(value => ({
            type: 'ValueChange',
            value
        }))(value$),

        map(value => ({
            type: 'ValueSet',
            value
        }))(valueSet$),

        map(() => ({
            type: 'Start'
        }))(mount$),

        map(() => ({
            type: 'Stop'
        }))(unmount$),

        map(() => ({
            type: 'LinkClick'
        }))(linkClick$)
    )
}

export default aperture
