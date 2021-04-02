import React from 'react'
import { heuristic_evaluate } from '../AI/Minimax'
import { Board } from '../Board/Board'

// const board = Board.fromBoardString('OOOX\n----\n----\n--XX\n',4)
const target = 2
// const board = Board.fromBoardString('O-X\n-O-\n---\n',target)
const board = Board.fromBoardString('X-O\n-X-\n---\n',target)
// const board = Board.fromBoardString('OOOX\n----\nXXXX\n--XX\n',4)
const state = board.getGameState()
const score = heuristic_evaluate(state,target)
console.log(score)
// const state:IGameState = [
//     [1,1,0,1,1],
//     [1,0,1,0,0],
//     [1,0,0,0,0],
//     [0,0,1,0,0],
//     [0,0,1,0,0],
// ]

// const state:IGameState = [
//     [1,1,0,1,1],
//     [1,0,0,1,0],
//     [1,0,1,0,0],
//     [0,1,1,1,0],
//     [1,0,1,0,1],
// ]

// const state: IGameState = [
//     [ 1, 1, 0],
//     [ 1,-1, 1],
//     [ 0,-1, 0],
// ]

// const state: IGameState = [
//     [ 1, 1, -1, 1],
//     [ 1,-1,  0, 0],
//     [ 0, 1,  0, 0],
//     [ 0,-1,  0, 0],
// ]

// getBestMove(state,4,16,1)

// const state:IGameState = [
//     [1,1,0,1],
//     [1,0,1,1],
//     [1,1,1,0],
//     [1,1,1,0]
// ]

// const game = Game.fromState(state, () => {})

// const score = game.evaluate(state,1)

// console.log('Score:', score)

// let count = game.countMaxAdjacentSymbols([0,1,1,1,1,1,1,1,0,1,1,1,0,0,-1,-1,0],1)
// console.log("MAX COUNT :",count)
export const Test = () => {
    return (
        <h1>Test</h1>
    )
}