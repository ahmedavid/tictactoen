import { IGameState, IPlayer } from "../utils/interfaces"
import { minimaxHelper } from "./Minimax"

export class Agent {

    constructor(private gameState: IGameState,private n :number, private target: number) {}

    getBestMove(state: IGameState,target:number,depth: number,player: IPlayer) {
        console.log("START minimax depth: ", depth)
        const best = minimaxHelper(state,target,depth,player)
        console.log("Minimax Finish BEST:", best.action,"UTIL: ",best.util)
        return best.action
    }
}