module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '.*/index.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json'
        }
    },
    verbose: true,
    testURL: 'http://localhost/'
}
