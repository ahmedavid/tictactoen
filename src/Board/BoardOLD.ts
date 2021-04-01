export const a = 1
// import { Agent } from "../AI/Agent"
// import { ICellState, IGameState, IPlayer } from "../utils/interfaces"

// const parseBoardString = (boardString: string): IGameState => {
//     const board: ICellState[][] = []
//     boardString.trim()
//     let rows = boardString.split('\n')
//     for(let i=0;i<rows.length-1;i++) {
//         board.push([])
//         const symbols = rows[i].split('')
//         for(let j=0;j<symbols.length;j++) {
//             if(symbols[j] === 'X')
//                 board[i].push(-1)
//             else if(symbols[j] === 'O')
//                 board[i].push(1)
//             else 
//                 board[i].push(0)
//         }
//     }

//     return board
// }

// function copyState(state: IGameState): IGameState {
//     const n = state.length
//     const newState = []
//     for(let i=0;i<n;i++) {
//         newState.push([...state[i]])
//     }

//     return newState
// }

// export class Board {
//     private agent: Agent
//     private constructor(private gameState: IGameState,private n :number, private target: number) {
//         this.agent = new Agent(gameState,n,target)
//     }

//     static fromBoardString(boardString: string, target: number) {
//         const state = parseBoardString(boardString)
//         const n = state.length
//         if(!target) target = n
//         return new Board(state,n,target)
//     }

//     getGameState() {
//         return copyState(this.gameState)
//     }

//     getAgent() {
//         return this.agent
//     }

//     getBestMove(player:IPlayer, depth: number) {
//         return this.agent.getBestMove(copyState(this.gameState),this.target,depth,player)
//     }

//     determineNextPlayer() {
//         const n = this.gameState.length
//         let xCount = 0
//         let oCount = 0

//         for(let i=0;i<n;i++) {
//             for(let j=0;j<n;j++) {
//                 if(this.gameState[i][j] === -1)
//                     xCount++
//                 if(this.gameState[i][j] === 1)
//                     oCount++
//             }
//         }
//         if(oCount === 0 || oCount === xCount) {
//             return 1
//         }
//         else {
//             return -1
//         }
//     }
// }
