import PriorityQueue from "ts-priority-queue"

export type ICellState = 0 | 1 | -1
export type IPlayer = 1 | -1
export type IGameState = ICellState[][]
export type IScoredAction = {action:IAction,score:number}

let count = 0

export interface IAction {
    x: number
    y: number
}

function countMaxAdjacentSymbols(arr: Array<ICellState>, player: IPlayer) {
    let maxCount = 0
    let count = 0
    const set = new Set(arr)
    let full = !set.has(0) && set.size === 1

    for(let i=0;i<arr.length;i++) {
        if(arr[i] === -player) {
            maxCount = Math.max(maxCount,count)
            count = 0
        } else if(arr[i] === player || arr[i] === 0) {
            count = full ? count + 2*2 : count + 2
            if(arr[i] === 0) {
                count++
            }
        }
    }

    return maxCount = Math.max(maxCount,count)
}

export class Game {
    isGameOver = false
    gameState: IGameState = []

    actionUtilMap : {[key:string]: ICellState} = {}

    determineNextPlayer() {
        const n = this.gameState.length
        let xCount = 0
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                if(this.gameState[i][j] === -1)
                    xCount++
            }
        }

        let oCount = 0
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                if(this.gameState[i][j] === 1)
                    oCount++
            }
        }


        if(oCount === 0 || oCount === xCount) {
            this.nextPlayer = 1
        }
        else {
            this.nextPlayer = -1
        }
    }

    static fromState(state: IGameState,n:number,target: number, notify: Function) {
        const game = new Game(n,target,1,notify)
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                game.gameState[i][j] = state[i][j]
            }
        }

        game.determineNextPlayer()
        notify(game.getNextPlayer())

        return game
    }

    private constructor(private n:number,private target: number, private nextPlayer: ICellState, private notify: Function) {
        this.initStateMatrix(n)
    }

    getNextPlayer() {
        return this.nextPlayer
    }

    toggleNextPlayer() {
        this.nextPlayer = this.nextPlayer === 1 ? -1 : 1
        this.notify(this.nextPlayer)
    }

    getN() {
        return this.gameState.length
    }

    initStateMatrix(n:number) {
        for(let i=0;i<n;i++) {
            this.gameState.push([])
            for(let j=0;j<n;j++) {
                this.gameState[i].push(0)
            }
        }
    }

    copyState(state: IGameState) {
        const n = state.length
        const newState = []
        for(let i=0;i<n;i++) {
            newState.push([...state[i]])
        }

        return newState
    }

    applyAction(state: IGameState,player: ICellState, action: IAction) {
        const {x,y} = action
        state[x][y] = player
        return state
    }

    revertAction(state: IGameState, action: IAction) {
        const {x,y} = action
        state[x][y] = 0
        return state
    }

    move(player:IPlayer , {x,y}: IAction) {
        if(this.isGameOver)
            return
        if(this.gameState[y][x] === 0) {
            this.gameState[y][x] = player
            this.toggleNextPlayer()
        }

        if(this.terminal(this.gameState,player,this.target)) {
            this.isGameOver = true
            const util = this.utility(this.gameState)
            console.log("FINISHED:", util)

            if(util === 1) {
                console.log("WINNER O")
            } else if(util === -1) {
                console.log("WINNER X")
            } else {
                console.log("DRAW")
            }
        }
    }

    async getBestMove(player: IPlayer): Promise<IAction> {
        return new Promise((res,rej) => {
            const n = this.gameState.length
            let depth = n*n
            console.log("Minimax Start:", depth)
            const bestMove = this.minimax(this.gameState,depth,-Infinity,Infinity,player,this.target)
            console.log("Minimax End: Count : ",count)
            return res(bestMove.action)
        })
    }

    minimax(state: IGameState,depth: number,alpha:number, beta: number, player: IPlayer,target: number) {
        count++
        const n = state.length
        if(depth === 0 || this.terminal(state,player,target)) {
            return {util: this.evaluate(state,player), action:{x:-1,y:-1}}
        }

        // Max player
        if(player === 1) {
            let v = -Infinity
            const agenda = this.actions(state,player)
            // if(agenda.length === n*n) {
            //     return {util: n*n, action: {x:0,y:0}}
            // }
            let maxAction = {
                util: -Infinity,
                action: {x:-1,y:-1}
            }
            while(agenda.length !== 0) {
                const {action} = agenda.dequeue()
                const newState = this.applyAction(state,1,action)
                const r = this.minimax(newState, depth-1, alpha, beta, -1, target)
                this.revertAction(state,action)
                v = Math.max(v, r.util)
                alpha = Math.max(alpha, v)
                if(alpha >= beta) {
                    // console.log("AB: ",alpha,beta)
                    break
                }
                if(v > maxAction.util) {
                    maxAction.util = v
                    maxAction.action = action
                }
            }
            return maxAction
        } 
        else {
            let v = Infinity
            const agenda = this.actions(state,player)
            let minAction = {
                util: Infinity,
                action: {x:-1,y:-1}
            }
            // if(agenda.length === n*n) {
            //     return {util: n*n, action: {x:0,y:0}}
            // }
            while(agenda.length !== 0) {
                const {action} = agenda.dequeue()
                const newState = this.applyAction(state,-1,action)
                const r = this.minimax(newState,depth-1,alpha,beta,1,target)
                this.revertAction(state,action)
                v = Math.min(v, r.util)
                beta = Math.min(beta,v)
                if(alpha >= beta) {
                    // console.log("AB: ",alpha,beta)
                    break
                }
                if(v < minAction.util) {
                    minAction.util = -v
                    minAction.action = action
                }
            }
            return minAction
        }
    }

    // Assume only called with a terminal state
    utility(state: IGameState): number {
        const n = state.length
        let rowSet = new Set<ICellState>()
        let colSet = new Set<ICellState>()
        let diag1Set = new Set<ICellState>()
        let diag2Set = new Set<ICellState>()

        for(let i=0;i<n;i++) {
            rowSet = new Set<ICellState>()
            colSet = new Set<ICellState>()
            for(let j=0;j<n;j++) {
                rowSet.add(state[i][j])
                colSet.add(state[j][i])

                if(i === j) {
                    diag1Set.add(state[i][j])
                }
                if(i + j === n - 1) {
                    diag2Set.add(state[i][j])
                }
            }

            // check rows
            if(rowSet.size === 1) {
                return Array.from(rowSet)[0]
            }

            //check cols
            if(colSet.size === 1) {
                return Array.from(colSet)[0]
            }
        }
        // check diagonals
        if(diag1Set.size === 1) {
            return Array.from(diag1Set)[0]
        }
        if(diag2Set.size === 1) {
            return Array.from(diag2Set)[0]
        }

        return 0
    }

    terminal(state: IGameState,player: IPlayer, target: number) {
        const util = this.utility(state)
        if(this.actions(state,player).length === 0 || util !== 0) {
            return true
        }
        
        // return false
        // const player1Score = this.evaluate(state,1)
        // const player2Score = this.evaluate(state,-1)
        // if(this.actions(state,1).length === 0 || player1Score >= target || player2Score >= target)
        //     return true
        
        return false
    }

    actions(state: IGameState,player: IPlayer) {
        const n = state.length
        const maxPQ = new PriorityQueue<IScoredAction>({comparator: (a,b) => b.score - a.score})
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                if(state[i][j] === 0) {
                    const action = {x:i,y:j}
                    const newState = this.applyAction(state,player,action)
                    const score = this.evaluate(newState,player)
                    maxPQ.queue({action,score})
                    this.revertAction(state,action)
                }
            }
        }
        return maxPQ
    }

    // Position is preferable if current player has more symbols on any row,col or diagonal
    // Score of the position is the max count of consequent symbols in a row, column and diagonal
    evaluate(state: IGameState,player: IPlayer) {
        const n = state.length
        let maxRow = 0
        let maxCol = 0
        let diag1Arr: ICellState[] = []
        let diag2Arr: ICellState[] = []
        for(let row=0;row<n;row++) {
            maxRow = Math.max(maxRow,countMaxAdjacentSymbols(state[row],player))
            let colArr: ICellState[] = []
            for(let col=0;col<n;col++) {
                colArr.push(state[col][row])
                // Diagonal 1
                if(col === row) {
                    diag1Arr.push(state[row][col])
                }
                // Diagonal 2
                if(col + row === n - 1) {
                    diag2Arr.push(state[row][col])
                }
            }
            maxCol = Math.max(maxCol,countMaxAdjacentSymbols(colArr,player)) 
        }

        let diag1 = countMaxAdjacentSymbols(diag1Arr,player)
        let diag2 = countMaxAdjacentSymbols(diag2Arr,player)

        return Math.max(maxRow,maxCol,diag1,diag2)
        //return maxRow + maxCol + diag1 +diag2
    }
}