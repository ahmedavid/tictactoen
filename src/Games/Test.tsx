import React from 'react'
import { Game, IGameState } from '../AI/Game'

// const state:IGameState = [
//     [1,1,0,1,1],
//     [1,0,1,0,0],
//     [1,0,0,0,0],
//     [0,0,1,0,0],
//     [0,0,1,0,0],
// ]

const state:IGameState = [
    [1,1,0,1,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [0,1,1,1,0],
    [1,0,1,0,1],
]

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