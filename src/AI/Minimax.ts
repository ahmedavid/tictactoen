import PriorityQueue from "ts-priority-queue"
import { getDiagonals } from "../utils/helpers"
import { IAction, ICellState, IGameState, IPlayer, IScoredAction } from "../utils/interfaces"



function getRemainingActions(state: IGameState, player: IPlayer,target: number): PriorityQueue<IScoredAction> {
    const n = state.length
    let pq:PriorityQueue<IScoredAction>
    if(player === 1)
        pq = new PriorityQueue<IScoredAction>({comparator: (a,b) => b.score - a.score})
    else {
        pq = new PriorityQueue<IScoredAction>({comparator: (a,b) => a.score - b.score})
    }
    for(let i=0;i<n;i++) {
        for(let j=0;j<n;j++) {
            if(state[i][j] === 0) {
                const action = {i,j}
                applyAction(state,player,action)
                const score = heuristic_evaluate(state,target)
                pq.queue({action,score})
                revertAction(state,action)
            }
        }
    }

    return pq
}
// [0,1,1,1,0,1,1,1,1]
export function maxRepeatingCount(arr:ICellState[], player: IPlayer) {
    let i = 0
    let maxCount = 0
    let count = 0
    while(i < arr.length) {
        if(arr[i] === player) {
            count++
        } else {
            maxCount = Math.max(maxCount,count)
            count = 0
        }
        i++
    }
    maxCount = Math.max(maxCount,count)

    return maxCount
}

export function checkWinInArray(arr:ICellState[], target: number) {
    const maxO = maxRepeatingCount(arr,1)
    if(maxO >= target) return 1
    const maxX = maxRepeatingCount(arr,-1)
    if(maxX >= target) return -1

    return 0
}

export function gameWon(state: IGameState,target: number) {
    return 1
}

function applyAction(state: IGameState,player: ICellState, {i,j}: IAction) {
    state[i][j] = player
    return state
}

function revertAction(state: IGameState, {i,j}: IAction) {
    state[i][j] = 0
    return state
}

let iterCount = 0
let pruneCount = 0

function countMaxAdjacentSymbols(arr: Array<ICellState>, player: IPlayer) {
    let maxCount = 0
    let count = 0

    for(let i=0;i<arr.length;i++) {
        if(arr[i] === -player || arr[i] === 0) {
            maxCount = Math.max(maxCount,count)
            count = 0
        } else {
            count++
        }
    }

    return maxCount = Math.max(maxCount,count)
}

function getScore(count:number) {
    return count > 0 ? Math.pow(10,count-1) : 0
}

/**
 * Evaluate position based on number of adjacent symbols in a row, col and diagonals
 * n in row 10^(n-1) points
 */
export function heuristic_evaluate(state: IGameState,target:number) {
    let scoreO = 0
    let scoreX = 0
    const n = state.length

    let row: ICellState[] = []
    let col: ICellState[] = []

    for(let i=0;i<n;i++) {
        for(let j=0;j<n;j++) {
            row.push(state[i][j])
            col.push(state[j][i])
        }

        const countO = countMaxAdjacentSymbols(row,1)
        const countOCol = countMaxAdjacentSymbols(col,1)
        if(countO >= target || countOCol >= target) return MAX

        const countX = countMaxAdjacentSymbols(row,-1)
        const countXCol = countMaxAdjacentSymbols(col,-1)
        if(countX >= target || countXCol >= target) return -MAX

        row = []
        col = []

        scoreO += getScore(countO) + getScore(countOCol)
        scoreX += getScore(countX) + getScore(countXCol)        
    }

    let diagonalScoreO = 0
    let diagonalScoreX = 0

    for(const diagonal of getDiagonals(state)) {
        const countDiagO = countMaxAdjacentSymbols(diagonal,1)
        if(countDiagO >= target) return MAX
        const countDiagX = countMaxAdjacentSymbols(diagonal,-1)
        if(countDiagX >= target) return -MAX

        diagonalScoreO += getScore(countDiagO)
        diagonalScoreX += getScore(countDiagX)
    }

    scoreO += diagonalScoreO
    scoreX += diagonalScoreX

    return scoreO - scoreX
}

const MAX = Number.MAX_VALUE
let start_depth = -1

export function minimaxHelper(state: IGameState,target:number,depth: number,player: IPlayer) {
    start_depth = depth
    const actions = getRemainingActions(state,player,target)
    const n = state.length * state.length
    if(n === actions.length) {
        console.log('First move play top left')
        return {util:0,action:{i:0,j:0}}
    }
    
    return minimax(state,target,depth,player,-Infinity,Infinity)
}

function minimax(state: IGameState,target:number,depth: number,player: IPlayer,alpha:number,beta:number) {
    const score = heuristic_evaluate(state,target)
    
    let winner = 0
    if(score === MAX)
        winner = 1
    if(score === -MAX)
        winner = -1

    const actions = getRemainingActions(state,player,target)
    
    if(depth === 0 || actions.length === 0 || winner) {
        const penalty = start_depth - depth
        if(winner || depth === 0) {
            iterCount=0
            pruneCount = 0
            return {util:score < 0 ? score + penalty : score - penalty, action:{i:-1,j:-1}}
        }     
        
        return {util:0, action:{i:-1,j:-1}}
    }

    // Max player
    if(player === 1) {
        let maxAction = {
            util: -Infinity,
            action: {i:-1,j:-1}
        }
        while(actions.length !== 0) {
            const {action} = actions.dequeue()
            const newState = applyAction(state,player,action)
            const minEvaluation = minimax(newState, target, depth-1, -1, alpha, beta)
            revertAction(state,action)
            if(minEvaluation.util > maxAction.util) {
                maxAction.util = minEvaluation.util
                maxAction.action = action
            }

            alpha = Math.max(alpha,minEvaluation.util)

            if(alpha >= beta) {
                pruneCount++
                break
            }
        }

        return maxAction
    }
    // Min Player
    {
        let minAction = {
            util: Infinity,
            action: {i:-1,j:-1}
        }
        while(actions.length !== 0) {
            const {action,score} = actions.dequeue()
            const newState = applyAction(state,player,action)
            const maxEvaluation = minimax(newState, target, depth-1, 1, alpha, beta)
            revertAction(state,action)
            if(maxEvaluation.util < minAction.util) {
                minAction.util = maxEvaluation.util
                minAction.action = action
            }

            beta = Math.min(beta, maxEvaluation.util)

            if(alpha >= beta) {
                pruneCount++
                break
            }
        }

        return minAction
    }
}