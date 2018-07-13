/// <reference types="react" />
import * as React from 'react'
import { ErrorHandler, Handler } from './baseTypes'
import { Aperture } from './observable'
export declare const withEffects: <P, E>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (
    aperture: Aperture<P, E>
) => (BaseComponent: React.ComponentType<P>) => React.ComponentClass<P>
