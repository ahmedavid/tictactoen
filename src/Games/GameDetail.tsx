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
    const [depth,setDepth] = useState(-1)

    const handleEvaluateBoard = (player: IPlayer) => {
        // const g = Game.fromState(gameState!,gameState!.length,gameState!.length,() => {})
        // const score = g.evaluate(gameState!,player)
        // console.log("Board Score for : ",player, score)
    }

    const requestAIMove = async () => {
        const {x,y} = board.getBestMove(nextPlayer as IPlayer,4)
        makeMove(x,y)
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

    const makeMove = async (x:number,y:number) => {
        const np = nextPlayer
        const newMove:IMove = {
            moveX: x,
            moveY: y,
            teamId: np === 1 ? team1Id : team2Id,
            gameId: parseInt(gameId),
            symbol: np === 1 ? "O" : "X",
            move: x+","+y
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

    useEffect(() => {
        if(team1Id === "test") {
            // const testBoardStr = "XXX---\n------\n------\n------\n------\n---O-\n"
            // 4x4
            // const testBoardStr = "XXXO\n---X\n---O\nXOOO\n"
            const testBoardStr = "X--O-\nX----\nO---O\n---XO\nX----\n"
            const target = 5
            // const testBoardStr = "O--\n---\n--X\n"
            // const testBoardStr = "---\n---\n---\n"
            // const parsed = parseBoardString(testBoardStr)
            // const n = parsed.length
            // game = Game.fromState(parsed,n,target,receiveNextPlayer)
            // const nextP = game.getNextPlayer()
            // agent = Agent.fromBoardString(testBoardStr,target)
            // const nextP = agent.determineNextPlayer()
            // setNextPlayer(nextP)
            // setGameState(game.copyState(game.gameState))
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