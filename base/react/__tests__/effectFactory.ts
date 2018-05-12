import { map, mapTo, concat } from 'rxjs/operators'
import { merge } from 'rxjs'

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

    return merge<Effect>(
        value$.pipe(
            map(value => ({
                type: 'ValueChange',
                value
            }))
        ),

        valueSet$.pipe(
            map(value => ({
                type: 'ValueSet',
                value
            }))
        ),

        mount$.pipe(
            mapTo({
                type: 'Start'
            })
        ),

        unmount$.pipe(
            mapTo({
                type: 'Stop'
            })
        )
    )
}

export default effectFactory
