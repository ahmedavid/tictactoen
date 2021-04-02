const assert = require('assert')
const { getDiagonals } = require('../utils/helpers')

describe('Test Diagonals 3X3', () => {
    it('3x3 Matrix has 10 diagonals', () => {
        const state = [
            [1,-1, 1],
            [1,-1, 1],
            [0, 0,-1],
        ]
        const diagonals = getDiagonals(state)
        // console.log(diagonals)
        assert.strictEqual(diagonals.length,10)
    })
})

describe('Test Diagonals 4x4', () => {
    it('4x4 Matrix has 14 diagonals', () => {
        const state = [
            [1,-1, 1, 1],
            [1,-1, 1, 1],
            [0, 0,-1, 0],
            [0, 0, 0, 0],
        ]
        const diagonals = getDiagonals(state)
        // console.log(diagonals)
        assert.strictEqual(diagonals.length,14)
    })
})