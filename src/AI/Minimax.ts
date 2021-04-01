import PriorityQueue from "ts-priority-queue"
import { IAction, ICellState, IGameState, IPlayer, IScoredAction } from "../utils/interfaces"

function copyAndSort(state: IGameState) {
    let copied: IGameState = []
    for(let i=0;i<state.length;i++) {
        copied.push([...state[i]])
    }

    let sorted: IGameState = []
}

function getRemainingActions(state: IGameState, player: IPlayer): PriorityQueue<IScoredAction> {
    const n = state.length
    let pq:PriorityQueue<IScoredAction>
    if(player === 1)
        pq = new PriorityQueue<IScoredAction>({comparator: (a,b) => a.score - b.score})
    else {
        pq = new PriorityQueue<IScoredAction>({comparator: (a,b) => b.score - a.score})
    }
    for(let i=0;i<n;i++) {
        for(let j=0;j<n;j++) {
            if(state[i][j] === 0) {
                const action = {i,j}
                applyAction(state,player,action)
                const score = heuristic_evaluate(state)
                pq.queue({action,score})
                revertAction(state,action)
            }
        }
    }

    return pq
}

export function checkWinInArray(arr:ICellState[], target: number) {
    let c1 = arr[0] === 1 ? 1 : 0 
    let c2 = arr[0] === -1 ? 1 : 0 
    for(let i=0;i<arr.length;i++) {
        if(arr[i] === arr[i+1]) {
            if(arr[i] === 1) {
                c1++
            }
            if(arr[i] === -1) {
                c2++
            }
            if(c1 >= target) {
                return 1
            }
            if(c2 >= target)
                return -1
        } else {
            c1 = 0
            c2 = 0
        }
    }
    return 0
}

export function gameWon(state: IGameState,target: number) {
    const n = state.length
    let rowWin = 0
    let colWin = 0
    const diag1:ICellState[] = []
    const diag2:ICellState[] = []

    for(let i=0;i<n;i++) {
        const rowArr:ICellState[] = []
        const colArr:ICellState[] = []
        for(let j=0;j<n;j++) {
            rowArr.push(state[i][j])
            colArr.push(state[j][i])

            if(i === j) {
                diag1.push(state[i][j])
            }
            if(i + j === n - 1) {
                diag2.push(state[i][j])
            }
        }

        // check curr row for win
        rowWin = checkWinInArray(rowArr,target)
        // check curr col for win
        colWin = checkWinInArray(colArr,target)

        if(rowWin || colWin) return rowWin || colWin
    }

    const diag1Win = checkWinInArray(diag1,target)
    const diag2Win = checkWinInArray(diag2,target)

    return diag1Win || diag2Win
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

/**
 * Evaluate position based on number of adjacent symbols in a row, col and diagonals
 * n in row 10^(n-1) points
 */
export function heuristic_evaluate(state: IGameState) {
    let scoreO = 0
    let scoreX = 0
    const len = state.length
    const n = Math.sqrt(len)

    let row: ICellState[] = []
    let col: ICellState[] = []
    let diag1: ICellState[] = []
    let diag2: ICellState[] = []

    for(let i=0;i<n;i++) {
        for(let j=0;j<n;j++) {
            row.push(state[i][j])
            col.push(state[j][i])

            if(i == j) {
                diag1.push(state[i][j])
            }
            if(i + j === n - 1) {
                diag2.push(state[i][j])
            }
        }

        const countO = countMaxAdjacentSymbols(row,1)
        const countX = countMaxAdjacentSymbols(row,-1)
        const countOCol = countMaxAdjacentSymbols(col,1)
        const countXCol = countMaxAdjacentSymbols(col,-1)

        row = []
        col = []

        if(countO > 0)
            scoreO += Math.pow(10,countO-1)
        if(countX > 0)
            scoreX -= Math.pow(10,countX-1)        
        if(countOCol > 0)
            scoreO += Math.pow(10,countOCol-1)
        if(countXCol > 0)
            scoreX -= Math.pow(10,countXCol-1)
    }

    const countDiag1O = countMaxAdjacentSymbols(diag1,1)
    const countDiag2O = countMaxAdjacentSymbols(diag2,1)
    const countDiag1X = countMaxAdjacentSymbols(diag1,1)
    const countDiag2X = countMaxAdjacentSymbols(diag2,1)

    if(countDiag1O > 0)
        scoreO += Math.pow(10,countDiag1O-1)
    if(countDiag2O > 0)
        scoreO += Math.pow(10,countDiag2O-1)

    if(countDiag1X > 0)
        scoreX -= Math.pow(10,countDiag1X-1)
    if(countDiag2X > 0)
        scoreX -= Math.pow(10,countDiag2X-1)

    return scoreO + scoreX
}

export function minimax(state: IGameState,n:number,target:number,depth: number,player: IPlayer,alpha:number,beta:number,action: IAction) {
    iterCount++
    if(depth === 0) {
        const evaluation = heuristic_evaluate(state)
        iterCount=0
        pruneCount = 0
        return {util:evaluation, action}
    }
    const actions = getRemainingActions(state,player)
    const winner = gameWon(state,target)
    if(actions.length === 0 || winner) {
        console.log("IterCount:", iterCount, "PruneCount:", pruneCount)
        iterCount=0
        pruneCount = 0

        let util = 0
        if(winner) {
            util = (Math.pow(10,target) - depth)*winner
        }
        console.log("MINMAX DEPTH: ",depth)
        return {util,action}
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
            const minEvaluation = minimax(newState,n, target, depth-1, -1, alpha, beta,action)
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
            const {action} = actions.dequeue()
            const newState = applyAction(state,player,action)
            const maxEvaluation = minimax(newState,n, target, depth-1, 1, alpha, beta,action)
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