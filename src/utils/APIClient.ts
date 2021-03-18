import axios from 'axios'

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

const parseBoardString = (boardString: string) => {
    const board: number[][] = []
    boardString.trim()
    let rows = boardString.split('\n')
    for(let i=0;i<rows.length-1;i++) {
        board.push([])
        const symbols = rows[i].split('')
        for(let j=0;j<symbols.length;j++) {
            if(symbols[j] === 'X')
                board[i].push(1)
            else if(symbols[j] === 'O')
                board[i].push(-1)
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

    async createGame(teamId1:number, teamId2: number,boardSize:number) {
        try {
            const response = await axios.post(`${BASE_URL}creategame?teamId1=${teamId1}&teamId2=${teamId2}&boardSize=${boardSize}`)
            return response.data
        } catch (error) {
            console.log("ERROR:", error)            
        }
    }

    async gameList(): Promise<IGame[]> {
        try {
            const response = await axios.get<IGameListResponse>(`${BASE_URL}gamelist`)
            console.log("Game List Success:", response)
            return response.data.myGames
        } catch (error) {
            console.error("Error getting games")            
        }
        return []
    }

    async getBoard(gameId: number) {
        try {
            const response = await axios.get<IGameBoardResponse>(`${BASE_URL}board?gameId=${gameId}`)
            console.log("Board Success:\n", response.data.output)
            return parseBoardString(response.data.output)
        } catch (error) {
            console.error("Error getting board")            
        }
        return []
    } 

    async move (move: IMove): Promise<number> {
        if(!this.isWorking) {
            this.isWorking = true
            try {
                const response = await axios.post<IGameMoveResponse>(`${BASE_URL}move`,move)
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