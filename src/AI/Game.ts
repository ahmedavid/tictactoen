export type ICellState = 0 | 1 | -1
export type IGameState = ICellState[][]

export interface IAction {
    x: number
    y: number
}

export class Game {
    isFinished = false
    gameState: IGameState = []

    actionUtilMap : {[key:string]: ICellState} = {}

    setNextPlayer() {
        const n = this.gameState.length
        let xCount = 0
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                if(this.gameState[i][j] === 1)
                    xCount++
            }
        }

        let oCount = 0
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                if(this.gameState[i][j] === -1)
                    oCount++
            }
        }


        if(oCount === 0 || oCount === xCount) {
            this.nextPlayer = -1
        }
        else {
            this.nextPlayer = 1
        }
    }

    static fromState(state: IGameState,notify: Function) {
        const n = state.length
        const game = new Game(n,-1,notify)
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                game.gameState[i][j] = state[i][j]
            }
        }

        game.setNextPlayer()
        notify(game.getNextPlayer())

        return game
    }

    constructor(private n:number, private nextPlayer: ICellState, private notify: Function) {
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

    result(state: IGameState,player: ICellState, action: IAction) {
        const {x,y} = action
        state[y][x] = player
        return state
    }

    move(player:ICellState , {x,y}: IAction) {
        if(this.isFinished)
            return
        if(this.gameState[y][x] === 0) {
            this.gameState[y][x] = player
            this.toggleNextPlayer()
        }

        if(this.terminal(this.gameState)) {
            this.isFinished = true
            const util = this.utility(this.gameState)
            console.log("FINISHED:", util)

            if(util === 1) {
                console.log("WINNER X")
            } else if(util === -1) {
                console.log("WINNER O")
            } else {
                console.log("DRAW")
            }
        }
    }

    // render() {
    //     this.renderer.renderBoard(this.gameState)
    // }

    async getBestMove(): Promise<IAction> {
        return new Promise((res,rej) => {
            const n = this.gameState.length
            const depth = n > 4 ? 4 : n
            const bestMove = this.minimax(this.gameState,depth,-Infinity,Infinity,false)
            return res(bestMove.action)
        })
    }

    minimax(state: IGameState,depth: number,alpha:number, beta: number, maxPlayer: boolean) {
        if(depth === 0 || this.terminal(state)) {
            return {util: this.utility(state), action:{x:-1,y:-1}}
        }

        if(maxPlayer) {
            let v = -Infinity
            const actionsList = this.actions(state)
            let maxAction = {
                util: -Infinity,
                action: {x:-1,y:-1}
            }
            for(const action of actionsList) {
                const copyState =  this.copyState(state)
                const newState = this.result(copyState,1,action)
                const r = this.minimax(newState,depth-1,alpha,beta,false)
                v = Math.max(v, r.util)
                alpha = Math.max(alpha,v)
                if(alpha >= beta) {
                    console.log("AB: ",alpha,beta)
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
            const actionsList = this.actions(state)
            let minAction = {
                util: Infinity,
                action: {x:-1,y:-1}
            }
            for(const action of actionsList) {
                const copyState =  this.copyState(state)
                const newState = this.result(copyState,-1,action)
                const r = this.minimax(newState,depth-1,alpha,beta,true)
                v = Math.min(v, r.util)
                beta = Math.max(beta,v)
                if(alpha >= beta) {
                    console.log("AB: ",alpha,beta)
                    break
                }
                if(v < minAction.util) {
                    minAction.util = v
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

    terminal(state: IGameState) {
        const util = this.utility(state)
        if(this.actions(state).length === 0 || util !== 0) {
            return true
        }
        
        return false
    }

    actions(state: IGameState) {
        const n = state.length
        const actions: IAction[] = []
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++) {
                if(state[i][j] === 0)
                    actions.push({x:j,y:i})
            }
        }

        return actions
    }
}