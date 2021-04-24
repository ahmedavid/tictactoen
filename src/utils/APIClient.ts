import axios from 'axios'
import { trackPromise } from 'react-promise-tracker';
import { toast } from 'react-toastify';
import { IMove } from './interfaces';

export type IGame = {[key:string]: string}
export interface APIResponse {
    code: string
    message?: string
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

interface IWorldStatus extends APIResponse {
    state: string
    world: string
}

interface IRunStatus extends APIResponse {
    runId: number
    state: string
    worldId: number
}
export interface IMoveStatus extends APIResponse {
    runId: number
    newState: {x:number,y:number}
    worldId: number
    reward: number
    scoreIncrement: number
}
export interface IPos {
    x: number
    y: number
}
export type IDirection = 'E' | 'W' | 'N' | 'S'


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

    async getRuns(){
        try {
            const response = await trackPromise(axios.get(`${BASE_URL}qrl/getruns`))
            console.log("Runs Success:\n", response.data)
            if(response.data.code === "OK") {
                return response.data
            }
        } catch (error) {
            console.error("Error getting runs")            
        }
        return {code: "FAIL",world: "-1", state: ""}
    } 

    async getLocation(): Promise<IWorldStatus> {
        try {
            const response = await trackPromise(axios.get<IWorldStatus>(`${BASE_URL}qrl/getlocation`))
            // console.log("Location Success:\n", response.data)
            if(response.data.code === "OK") {
                return response.data
            }
        } catch (error) {
            console.error("Error getting location")            
        }
        return {code: "FAIL",world: "-1", state: ""}
    } 

    async enterWorld(worldId: string, teamId: number): Promise<IRunStatus | undefined> {
        const body = {
            type: 'enter',
            worldId,
            teamId
        }
        try {
            const response = await trackPromise(axios.post(`${BASE_URL}qrl/enterworld`, body))
            if(response.data.code === "OK") {
                console.log("World Enter Success:\n", response.data)
                return response.data
            }
            throw new Error(response.data.message)
        } catch (error) {
            console.error(error)       
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });     
        }
    } 

    async agentMove(worldId: string, teamId: number,move:IDirection) {
        const body = {
            type: 'move',
            worldId,
            teamId,
            move
        }

        try {
            const response = await trackPromise(axios.post<IMoveStatus>(`${BASE_URL}qrl/move`, body))
            if(response.data.code === "OK") {
                // console.log("Agent Move Success:\n", response.data)
                const data = {...response.data}
                data.newState.x = parseInt(data.newState.x+"")
                data.newState.y = parseInt(data.newState.y+"")
                return data
            }
            throw new Error(response.data.message)
        } catch (error) {
            console.error(error)            
        }
    }

    async uploadWorld(formData:FormData) {
        try {
            const response = await trackPromise(axios.post<APIResponse>(`${BASE_URL}qrl/uploadworld`, formData, 
            {headers:{'Content-Type': 'multipart/form-data'}}
            ))
            toast.success("World Persisted", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                }); 
        } catch (error) {
            console.log(error)
        }
    }

    // async saveWorld(worldName:string, data: any) {
    //     const body = {
    //         worldName,
    //         data
    //     }

    //     try {
    //         const response = await trackPromise(axios.post<IMoveStatus>(`${BASE_URL}qrl/saveworld`, body))
    //         if(response.data.code === "OK") {
    //             console.log("Save world Success:\n", response.data)
    //             return data
    //         }
    //         throw new Error(response.data.message)
    //     } catch (error) {
    //         console.error(error)            
    //     }
    // }

    async getWorld(worldName:string) {

        try {
            const response = await trackPromise(axios.get(`${BASE_URL}worlds/${worldName}`))
            if(response.status === 200) {
                console.log("Get World Success:\n")
                return response.data
            }
            throw new Error("Unable to download world")
        } catch (error) {
            console.error(error)            
        }
    }
}