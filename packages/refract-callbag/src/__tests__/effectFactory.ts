import { merge, map } from 'callbag-basics'

import { EffectFactory } from '../index'

export interface Effect {
    type: string
    value?: number
}

export interface Props {
    value: number
    setValue: (value: number) => void
}

const effectFactory: EffectFactory<Props, Effect> = props => component => {
    const value$ = component.observe<number>('value')
    const valueSet$ = component.observe<number>('setValue')
    const mount$ = component.mount
    const unmount$ = component.unmount

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
        }))(unmount$)
    )
}

export default effectFactory
