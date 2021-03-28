import axios from 'axios'
import { trackPromise } from 'react-promise-tracker';
import { toast } from 'react-toastify';
import { ICellState } from '../AI/Game';

export type IGame = {[key:string]: string}
export interface APIResponse {
    code: string
}
export interface IGameListResponse extends APIResponse {
    myGames: IGame[]
}

export interface IGameBoardResponse extends APIResponse{
    output: string
    target?:number
}

export interface IGameMoveResponse extends APIResponse{
    moveId: number
}

export interface IMove {
    moveId?: number
    gameId: number
    teamId: string
    move?: string,
    symbol: "X" | "O"
    moveX: number
    moveY: number
}

export const parseBoardString = (boardString: string): ICellState[][] => {
    const board: ICellState[][] = []
    boardString.trim()
    let rows = boardString.split('\n')
    for(let i=0;i<rows.length-1;i++) {
        board.push([])
        const symbols = rows[i].split('')
        for(let j=0;j<symbols.length;j++) {
            if(symbols[j] === 'X')
                board[i].push(-1)
            else if(symbols[j] === 'O')
                board[i].push(1)
            else 
                board[i].push(0)
        }
    }

    return board
}

// const BASE_URL = 'http://localhost:8080/'
const BASE_URL = '/'

export class APIClient {
    isWorking = false
    private constructor() {}

    static getInstance() {
        return new APIClient()
    }

    async createGame(team1Id:number, team2Id: number,boardSize:number, target: number) {
        try {
            const data = {
                team1Id,
                team2Id,
                boardSize,
                target
            }
            let mainPart = `${BASE_URL}creategame`
            const response = await trackPromise(axios.post(mainPart,data))
            if(response.data.code === "FAIL")
                throw new Error(response.data)
            return response.data
        } catch (error) {
            toast.error('Create Game Failed', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            console.log("ERROR:", error)            
        }
    }

    async gameList(): Promise<IGame[]> {
        try {
            const response = await trackPromise(axios.get<IGameListResponse>(`${BASE_URL}gamelist`))
            console.log("Game List Success:", response)
            const games = response.data.myGames.slice()
            games.sort((a,b) => parseInt(Object.keys(a)[0]) - parseInt(Object.keys(b)[0]))
            return games
        } catch (error) {
            console.error("Error getting games")            
        }
        return []
    }

    async getBoard(gameId: number): Promise<{board: ICellState[][], target: number}> {
        try {
            const response = await trackPromise(axios.get<IGameBoardResponse>(`${BASE_URL}board?gameId=${gameId}`))
            console.log("Board Success:\n", response.data.output, response.data.target)
            if(response.data.code === "OK") {
                console.log(response.data)
                const parsed = parseBoardString(response.data.output)
                return {
                    board: parsed,
                    target: response.data.target ? response.data.target :  parsed.length
                }
            }
        } catch (error) {
            console.error("Error getting board")            
        }
        return {
            board: [],
            target: 0
        }
    } 

    async move (move: IMove): Promise<number> {
        if(!this.isWorking) {
            this.isWorking = true
            try {
                const response = await trackPromise(axios.post<IGameMoveResponse>(`${BASE_URL}move`,move))
                if(response.data.code === "FAIL") {
                    return -1
                }
                console.log("Move Success:", response)
                this.isWorking = false
                return response.data.moveId
            } catch (error) {
                console.error("Error making move")     
            }
            this.isWorking = false
        }
        this.isWorking = false
        return -1
    }
}