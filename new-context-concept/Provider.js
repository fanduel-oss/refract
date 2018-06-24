import React, { Component } from 'react'
import RefractContext from './Context'

export default class RefractProvider extends Component {
    constructor(allProps) {
        super(allProps)

        const { children, effectHandler, errorHandler, ...props } = this.props

        this.effectHandler = effectHandler(props)
        this.errorHandler = errorHandler(props)
    }

    render() {
        return (
            <RefractContext.Provider
                value={{
                    effectHandler: this.effectHandler,
                    errorHandler: this.errorHandler
                }}
            >
                {this.props.children}
            </RefractContext.Provider>
        )
    }
}
