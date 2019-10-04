import { useState } from 'react'

const StateContainer = props => {
    const [available, setAvailable] = useState(null)
    const [username, setUsername] = useState('')

    return props.children({
        available,
        username,
        setUsername,
        setAvailable
    })
}

export default StateContainer
