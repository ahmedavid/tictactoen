export type IPlayer = 1 | -1
export type ICellState = 0 | IPlayer

export type IGameState = ICellState[][]

export interface IAction {
    i: number
    j: number
}

export type IScoredAction = {action:IAction,score:number}

export interface IMove {
    moveId?: number
    gameId: number
    teamId: string
    move?: string,
    symbol: "X" | "O"
    moveX: number
    moveY: number
}

export function getCoords(index: number, len:number) {
    const i = Math.floor(index/len)
    const j = index % len
    return {i,j}
}