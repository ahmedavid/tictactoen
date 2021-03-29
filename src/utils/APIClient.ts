import axios from 'axios'
import { trackPromise } from 'react-promise-tracker';
import { toast } from 'react-toastify';
import { IMove } from './interfaces';

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

    async getBoardString(gameId: number): Promise<{boardString:string, target:number}> {
        try {
            const response = await trackPromise(axios.get<IGameBoardResponse>(`${BASE_URL}board?gameId=${gameId}`))
            console.log("Board Success:\n", response.data.output, response.data.target)
            if(response.data.code === "OK") {
                console.log(response.data)
                return {boardString: response.data.output, target: response.data.target ? response.data.target : 0}
            }
        } catch (error) {
            console.error("Error getting board")            
        }
        return {boardString: "", target: 0}
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