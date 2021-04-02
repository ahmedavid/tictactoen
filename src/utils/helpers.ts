import { ICellState, IGameState } from "./interfaces"

/**
 * We want overlapping diagonals, because we want to reward 
 * the agent for occupying most favorable positions
 */
export function getDiagonals(state: IGameState) {
    const n = state.length
    const diagonals: IGameState = []
    let index = 0

    for(let k=0;k<=n-1;k++) {
        let i = k
        let j = 0
        diagonals.push([])
        while(i >= 0) {
            diagonals[index].push(state[i][j])
            i--
            j++
        }
        index++
    }
    for(let k=1;k<=n-1;k++) {
        let i = n-1
        let j = k
        diagonals.push([])
        while(j <= n -1) {
            diagonals[index].push(state[i][j])
            i--
            j++
        }
        index++
    }

    // Reverse Diagonals
    for(let k=0;k<=n-1;k++) {
        let i = k
        let j = 0
        diagonals.push([])
        while(i >= 0) {
            diagonals[index].push(state[n-1-i][j])
            i--
            j++
        }
        index++
    }
    for(let k=1;k<=n-1;k++) {
        let i = n-1
        let j = k
        diagonals.push([])
        while(j <= n -1) {
            diagonals[index].push(state[n-1-i][j])
            i--
            j++
        }
        index++
    }


    return diagonals
}