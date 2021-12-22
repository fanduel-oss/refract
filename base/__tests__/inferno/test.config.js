const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-inferno')

enzyme.configure({ adapter: new Adapter() })
