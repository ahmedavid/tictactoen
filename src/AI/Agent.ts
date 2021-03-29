import { IGameState } from "../utils/interfaces"
import { IPlayer, minimax } from "./Minimax"

export class Agent {

    constructor(private gameState: IGameState,private n :number, private target: number) {}

    getBestMove(state: IGameState,target:number,depth: number,player: IPlayer) {
        const best = minimax(state,target,depth,player,-Infinity,Infinity,{x:-1,y:-1})
        console.log("BEST:", best.action)
        console.log("UTIL:", best.util)
        return best.action
        // console.log("Itercount:", iterCount)
        // console.log("PruneCount:", pruneCount)
        // console.log("AllWins:", allWins)
    }
}