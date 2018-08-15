const enzyme = require('enzyme')
const { Adapter } = require('enzyme-adapter-preact')

enzyme.configure({ adapter: new Adapter() })
