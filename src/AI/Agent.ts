import { IGameState, IPlayer } from "../utils/interfaces"
import { minimax } from "./Minimax"

export class Agent {

    constructor(private gameState: IGameState,private n :number, private target: number) {}

    getBestMove(state: IGameState,target:number,depth: number,player: IPlayer) {
        const n = Math.sqrt(state.length)
        console.log("START minimax depth: ", depth)
        const best = minimax(state,n,target,depth,player,-Infinity,Infinity,{i:-1,j:-1})
        console.log("Minimax Finish BEST:", best.action,"UTIL: ",best.util)
        return best.action
        // console.log("Itercount:", iterCount)
        // console.log("PruneCount:", pruneCount)
        // console.log("AllWins:", allWins)
    }
}