import { Component } from 'react'

class StateContainer extends Component {
    state = { available: null, username: '' }
    setAvailable = available => this.setState({ available })
    setUsername = username => this.setState({ available: null, username })

    render() {
        const { available, username } = this.state
        const { setAvailable, setUsername } = this

        return this.props.children({
            available,
            username,
            setAvailable,
            setUsername
        })
    }
}

export default StateContainer
