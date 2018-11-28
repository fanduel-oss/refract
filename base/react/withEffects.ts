import * as React from 'react'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'
import { ReactElement } from 'react'

export interface State {
    replace?: boolean
    props: object
    renderEffect: boolean
    children: React.ReactNode | null
}

export interface Config<P, E, C = any> {
    handler?: Handler<P, E, C>
    errorHandler?: ErrorHandler<P, C>
    Context?: React.Context<C>
    mergeProps?: boolean
    decorateProps?: boolean
}

const isComponentClass = (ComponentClass: any): boolean =>
    Boolean(
        ComponentClass &&
            ComponentClass.prototype &&
            ComponentClass.prototype.isReactComponent
    )

const Empty = () => null

export const withEffects = <P, E, CP = P, C = any>(
    aperture: Aperture<P, E, C>,
    config: Config<P, E, C> = {}
) => (
    BaseComponent: React.ComponentType<CP & { pushEvent: PushEvent }> = Empty
): React.ComponentClass<P> =>
    class WithEffects extends React.Component<P, State> {
        public static contextType = config.Context

        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (nextProps: P, nextState: State) => boolean
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => CP & { pushEvent: PushEvent }
        private mounted: boolean = false
        private unmounted: boolean = false

        constructor(props: any, context: any) {
            super(props, context)

            configureComponent(
                aperture,
                this,
                React.isValidElement,
                isComponentClass,
                config.handler,
                config.errorHandler,
                config.mergeProps,
                config.decorateProps !== false
            )
        }

        public componentDidMount() {
            this.mounted = true
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps: P) {
            this.reDecorateProps(nextProps)
            this.pushProps(nextProps)
        }

        public shouldComponentUpdate(nextProps, nextState) {
            return this.havePropsChanged(nextProps, nextState)
        }

        public componentWillUnmount() {
            this.unmounted = true
            this.triggerUnmount()
        }

        public render() {
            if (this.state.children) {
                return this.state.children
            }

            return React.createElement(BaseComponent, this.getChildProps())
        }
    }
