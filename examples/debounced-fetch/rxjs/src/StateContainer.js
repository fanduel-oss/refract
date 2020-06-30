import { useState } from 'react'

const StateContainer = props => {
    const [data, setData] = useState(null)
    const [username, setUsername] = useState('')

    return props.children({
        data,
        username,
        setUsername,
        setData
    })
}

export default StateContainer
