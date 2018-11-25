import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-rxjs'

const App = () => <p>Hello, world!</p>

const aperture = component => component.observe()

const handler = () => effect => console.log(effect)
const errorHandler = () => err => console.error(err)

const AppWithEffects = withEffects(aperture, { handler, errorHandler })(App)

render(<AppWithEffects />, document.getElementById('root'))
