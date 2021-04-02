const assert = require('assert')
const { maxRepeatingCount,checkWinInArray } = require('../AI/Minimax')

describe('Win test 1', () => {
    it('Winner is 1', () => {
        const arr = [1,1,1]
        const winner = checkWinInArray(arr,3)
        assert.strictEqual(winner,1)
    })
})

describe('Win test 2', () => {
    it('Winner is 1', () => {
        const arr = [0,1,1]
        const winner = checkWinInArray(arr,2)
        assert.strictEqual(winner,1)
    })
})

describe('Win test 3', () => {
    it('Winner is -1', () => {
        const arr = [0,1,1,-1,-1,-1]
        const winner = checkWinInArray(arr,3)
        assert.strictEqual(winner,-1)
    })
})

describe('Win test 4', () => {
    it('Winner is -1', () => {
        const arr = [0,-1,-1,1,1,-1,-1,-1]
        const winner = checkWinInArray(arr,3)
        assert.strictEqual(winner,-1)
    })
})


describe('Win test 5', () => {
    it('Winner is 0', () => {
        const arr = [0,-1,-1,1,1]
        const winner = checkWinInArray(arr,3)
        assert.strictEqual(winner,0)
    })
})
describe('Count test 1', () => {
    it('Should return 4', () => {
        const arr = [0,1,1,1,0,1,1,1,1]
        const cnt = maxRepeatingCount(arr,1)
        assert.strictEqual(cnt,4)
    })
})

describe('Count test 2', () => {
    it('Should return 4', () => {
        const arr = [1,1,1,1,0,1,1,1]
        const cnt = maxRepeatingCount(arr,1)
        assert.strictEqual(cnt,4)
    })
})
describe('Count test 2', () => {
    it('Should return 4', () => {
        const arr = [0,1,1,0,-1,-1,-1,0]
        const cnt = maxRepeatingCount(arr,1)
        assert.strictEqual(cnt,2)
    })
})
describe('Count test 2', () => {
    it('Should return 3', () => {
        const arr = [0,1,1,0,-1,-1,-1,0]
        const cnt = maxRepeatingCount(arr,-1)
        assert.strictEqual(cnt,3)
    })
})
