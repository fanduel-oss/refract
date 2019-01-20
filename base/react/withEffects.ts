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

export interface Config<Props, Effect, Context = any> {
    handler?: Handler<Props, Effect, Context>
    errorHandler?: ErrorHandler<Props, Context>
    Context?: React.Context<Context>
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

export const withEffects = <Props, Effect, ChildProps = Props, Context = any>(
    aperture: Aperture<Props, Effect, Context>,
    config: Config<Props, Effect, Context> = {}
) => (
    BaseComponent: React.ComponentType<
        ChildProps & { pushEvent: PushEvent }
    > = Empty
): React.ComponentClass<Props> =>
    class WithEffects extends React.Component<Props, State> {
        public static contextType = config.Context

        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (
            nextProps: Props,
            nextState: State
        ) => boolean
        private reDecorateProps: (nextProps: Props) => void
        private pushProps: (props: Props) => void
        private getChildProps: () => ChildProps & { pushEvent: PushEvent }
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

        public componentWillReceiveProps(nextProps: Props) {
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
