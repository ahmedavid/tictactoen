export type ICellState = 0 | 1 | -1

export type IPlayer = 1 | -1

export type IGameState = ICellState[][]

export interface IAction {
    x: number
    y: number
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