module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '.*/index.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    globals: {
        'ts-jest': {
            tsConfigFile: './tsconfig.json'
        }
    }
}
