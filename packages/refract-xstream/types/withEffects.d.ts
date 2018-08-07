/// <reference types="react" />
import * as React from 'react'
import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'
export declare const withEffects: <P, E>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (
    aperture: Aperture<P, E>
) => (
    BaseComponent: React.ComponentType<
        P & {
            pushEvent: PushEvent
        }
    >
) => React.ComponentClass<P>
