import { IAction } from "../utils/interfaces"

type ICellState = 0 | 1 | -1
type IGameState = ICellState[][]
export type IPlayer = 1 | -1

function getRemainingActions(state: IGameState) {
    const n = state.length
    const list = []
    for(let i=0;i<n;i++) {
        for(let j=0;j<n;j++) {
            if(state[i][j] === 0) {
                const action: IAction = {x:i,y:j}
                list.push(action)
            }
        }
    }

    return list
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

function applyAction(state: IGameState,player: ICellState, action: IAction) {
    const {x,y} = action
    state[x][y] = player
    return state
}

function revertAction(state: IGameState, action: IAction) {
    const {x,y} = action
    state[x][y] = 0
    return state
}

let iterCount = 0
let pruneCount = 0

const allWins: {[key:string]: number} = {
    "1": 0,
    "-1": 0
}



export function minimax(state: IGameState,target:number,depth: number,player: IPlayer,alpha:number,beta:number,action: IAction) {
    iterCount++
    const actions = getRemainingActions(state)
    const winner = gameWon(state,target)
    if(actions.length === 0 || winner) {
        // console.log("IterCount:", iterCount, "PruneCount:", pruneCount)
        let util = 0
        if(winner) {
            util = (winner * 100000) - depth*100
            allWins[winner+""] = allWins[winner] + 1
        }
        return {util,action:{x:-1,y:-1}}
    }

    // Max player
    if(player === 1) {
        let maxAction = {
            util: -Infinity,
            action: {x:-1,y:-1}
        }
        for(let action of actions) {
            const newState = applyAction(state,player,action)
            const minEvaluation = minimax(newState, target, depth-1, -1, alpha, beta,action)
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
            action: {x:-1,y:-1}
        }
        for(let action of actions) {
            const newState = applyAction(state,player,action)
            const maxEvaluation = minimax(newState, target, depth-1, 1, alpha, beta,action)
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