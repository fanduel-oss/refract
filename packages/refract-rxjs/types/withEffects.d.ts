/// <reference types="react" />
import * as React from 'react'
import { EffectHandler } from './baseTypes'
import { EffectFactory } from './observable'
export declare const withEffects: <P, E>(
    effectHandler: EffectHandler<P, E>,
    errorHandler?: (err: any) => void
) => (
    effectFactory: EffectFactory<P, E>
) => (BaseComponent: React.ComponentType<P>) => React.ComponentClass<P>
