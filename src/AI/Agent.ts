import { IGameState, IPlayer } from "../utils/interfaces"
import { minimax } from "./Minimax"

export class Agent {

    constructor(private gameState: IGameState,private n :number, private target: number) {}

    getBestMove(state: IGameState,target:number,depth: number,player: IPlayer) {
        console.log("START minimax depth: ", depth)
        const best = minimax(state,target,depth,player,-Infinity,Infinity)
        console.log("Minimax Finish BEST:", best.action,"UTIL: ",best.util)
        return best.action
        // console.log("Itercount:", iterCount)
        // console.log("PruneCount:", pruneCount)
        // console.log("AllWins:", allWins)
    }
}