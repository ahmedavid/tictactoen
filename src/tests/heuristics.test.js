const assert = require('assert')
const { heuristic_evaluate } = require('../AI/Minimax')

describe('Simple Math Test', () => {
    it('Should return 2', () => {
        assert.strictEqual(1+1,2)
    })
})

describe('3X3 O Wins', () => {
    it('Score should be Number MAX VALUE', () => {
        const state = [
            [1,-1, 1],
            [1,-1, 1],
            [1, 0, 0],
        ]
        const score = heuristic_evaluate(state,3)
        assert.strictEqual(score,Number.MAX_VALUE)
    })
})

describe('3X3 X Wins, ', () => {
    it('Score should be (-)Number MAX VALUE', () => {
        const state = [
            [-1, 1, 1],
            [-1, 1, 1],
            [-1, 0, 0],
        ]
        const score = heuristic_evaluate(state,3)
        assert.strictEqual(score,Number.MAX_VALUE*-1)
    })
})