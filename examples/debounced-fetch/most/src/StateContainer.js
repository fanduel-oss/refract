import { Component } from 'react'

class StateContainer extends Component {
    state = { data: null, username: '' }
    setUsername = username => this.setState({ username })
    setState = this.setState.bind(this)

    render() {
        const { data, username } = this.state
        const { setUsername, setState } = this

        return this.props.children({
            data,
            username,
            setUsername,
            setState
        })
    }
}

export default StateContainer
