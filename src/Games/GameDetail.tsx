import React, { useEffect, useState } from 'react'
import { Link,useParams } from 'react-router-dom'
import { APIClient } from '../utils/APIClient';
import { TicTacToe } from '../BoardUI/TicTacToe';
import { IGameState, IMove, IPlayer } from '../utils/interfaces';
import { Board } from '../Board/Board';

const STARTING_PLAYER = 1
let mySymbol = STARTING_PLAYER

let board: Board

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
    const [depth,setDepth] = useState(20)

    const handleEvaluateBoard = (player: IPlayer) => {
        // const g = Game.fromState(gameState!,gameState!.length,gameState!.length,() => {})
        // const score = g.evaluate(gameState!,player)
        // console.log("Board Score for : ",player, score)
    }

    const requestAIMove = async () => {
        const {i,j} = board.getBestMove(nextPlayer as IPlayer,depth)
        makeMove(i,j)
    }

    const receiveNextPlayer = (next: number) => {
        console.log("Receive next player: ", next)
        // if(game) {
        //     const n = game.getNextPlayer()
        //     setNextPlayer(n)
        //     setGameState(game.copyState(game.gameState))
        // }

    }
    
    const getBoard = async () => {
        console.log("GETTING BOARD...")
        const {boardString,target} = await apiClient.getBoardString(parseInt(gameId!))
        board = Board.fromBoardString(boardString,target)
        const nextP = board.determineNextPlayer()
        setGameState(board.getGameState())
        setNextPlayer(nextP)
        // const n = board.length
        // game = Game.fromState(board,n,target,receiveNextPlayer)
    }

    const refresh = () => {
        getBoard()
    }

    const makeMove = async (i:number,j:number) => {
        const np = nextPlayer
        const newMove:IMove = {
            moveX: i,
            moveY: j,
            teamId: np === 1 ? team1Id : team2Id,
            gameId: parseInt(gameId),
            symbol: np === 1 ? "O" : "X",
            move: i+","+j
        }
        
        if(gameId === "test") return
        if(newMove.moveX < 0 || newMove.moveY < 0) return
        
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

    useEffect(() => {
        if(team1Id === "test") {
            const testBoardStr = 'OXO\nOXO\nO--\n'
            const target = 3
            board = Board.fromBoardString(testBoardStr,target)
            const nextP = board.determineNextPlayer()
            setNextPlayer(nextP)
            const st = board.getGameState().slice()
            console.log(st)
            setGameState(st)
        }else {
            if(teamId === parseInt(team1Id)) {
                mySymbol = 1
            } else if(teamId === parseInt(team2Id)) {
                mySymbol = -1
            }
            getBoard()
        }

        // return () => clearInterval(id)
    },[])
    return (
        <div className="container">
            <Link className="btn btn-primary" to="/games">Back</Link>
            <button className="btn btn-success" onClick={() => handleEvaluateBoard(1)}>Evaluate For X</button>
            <button className="btn btn-success" onClick={() => handleEvaluateBoard(-1)}>Evaluate For O</button>
            <div>Curr Depth: {depth}</div>
            {
                gameState && 
                <TicTacToe 
                    sendDepth={depth => setDepth(depth)}
                    gameState={gameState} 
                    canPlay={nextPlayer === mySymbol}
                    nextPlayer={nextPlayer} 
                    refresh={refresh}
                    requestAIMove={() => requestAIMove()}/>
            }
        </div>
    )
}