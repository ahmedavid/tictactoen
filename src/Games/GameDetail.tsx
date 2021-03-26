import React, { useEffect, useState } from 'react'
import { Link,useParams } from 'react-router-dom'
import { APIClient, IMove } from '../utils/APIClient';
import { Game, IGameState } from '../AI/Game';
import { TicTacToe } from '../Board/TicTacToe';

const STARTING_PLAYER = -1
let mySymbol = -1

let game: Game

interface IProps {
    apiClient: APIClient,
    teamId: number
}

interface ParamTypes {
    team1Id: string
    team2Id: string
    gameId: string
}


export const GameDetail = ({apiClient, teamId}: IProps) => {
    // const [autoRefresh,setAutoRefresh] = useState(true)
    const {team1Id,team2Id,gameId} = useParams<ParamTypes>()
    const [gameState,setGameState] = useState<IGameState|null>(null)
    const [nextPlayer,setNextPlayer] = useState(STARTING_PLAYER)
    const [isMyTurn,setIsMyTurn] = useState(false)

    const requestAIMove = async (game: Game) => {
        return game.getBestMove()
    }

    const receiveNextPlayer = (next: number) => {
        console.log("Receive next player: ", next)
        if(game) {
            const n = game.getNextPlayer()
            setNextPlayer(n)
            setGameState(game.copyState(game.gameState))
        }
    }
    
    const getBoard = async () => {
        console.log("GETTING BOARD...")
        const boardState = await apiClient.getBoard(parseInt(gameId!))
        game = Game.fromState(boardState as IGameState,receiveNextPlayer)
        const nextP = game.getNextPlayer()
        setNextPlayer(nextP)
        setGameState(game.copyState(game.gameState))
    }

    const refresh = () => {
        getBoard()
    }

    const makeMove = async (x:number,y:number) => {
        const np = game.getNextPlayer()
        const newMove:IMove = {
            moveX: x,
            moveY: y,
            teamId: np === -1 ? team1Id : team2Id,
            gameId: parseInt(gameId),
            symbol: np === 1 ? "X" : "O",
            move: y+","+x
        }
        try {
            const moveId = await apiClient.move(newMove)
            if(moveId > 0) {
                getBoard()
            }
            console.log("Move Success ID: ", moveId)
        } catch (error) {
            console.log(error)
        }
    }

    // const handleAutoRefresh = (e:React.ChangeEvent<HTMLInputElement>) => {
    //     console.log("CHECKED: ",e.target.checked)
    //     setAutoRefresh(e.target.checked)
    // }


    useEffect(() => {
        // let id:NodeJS.Timeout = setInterval(() => {
        //     console.log("AUTOREFRESH IS: ", autoRefresh)
        //     if(checkAutoRefresh()) {
        //         getBoard()
        //         console.log('REFRESHING...')
        //     }
        // }, 12000)
        if(teamId === parseInt(team1Id)) {
            mySymbol = -1
        } else if(teamId === parseInt(team2Id)) {
            mySymbol = 1
        }
        getBoard()

        // return () => clearInterval(id)
    },[])
    return (
        <div className="container">
            <Link to="/games">Back</Link>
            {/* <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" defaultChecked={autoRefresh} onChange={handleAutoRefresh}/>
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Auto Refresh?</label>
            </div> */}
            {
                gameState && 
                <TicTacToe 
                    move={makeMove} 
                    gameState={gameState} 
                    canPlay={nextPlayer === mySymbol}
                    nextPlayer={nextPlayer} 
                    refresh={refresh}
                    requestAIMove={() => requestAIMove(game)}/>
            }
        </div>
    )
}