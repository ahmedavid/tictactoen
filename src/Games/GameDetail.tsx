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
    const {team1Id,team2Id,gameId} = useParams<ParamTypes>()
    const [gameState,setGameState] = useState<IGameState|null>(null)
    const [nextPlayer,setNextPlayer] = useState(STARTING_PLAYER)
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
    
    const getBoard = async () => {
        console.log("GETTING BOARD...")
        const {boardString,target} = await apiClient.getBoardString(parseInt(gameId!))
        board = Board.fromBoardString(boardString,target)
        const nextP = board.determineNextPlayer()
        setGameState(board.getGameState())
        setNextPlayer(nextP)
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
        if(teamId === parseInt(team1Id)) {
            mySymbol = 1
        } else if(teamId === parseInt(team2Id)) {
            mySymbol = -1
        }
        if(gameId === "test") {
            const testBoardStr = '-OX\n---\n---\n'
            // const testBoardStr = 'OOX\nXOO\n-XX\n'
            // const testBoardStr = 'O---\nX-O-\n-X--\n-XO-\n'
            // const testBoardStr = 'O----\nX--O-\n--X--\n--XO-\n--XO-\n'
            const target = 3
            board = Board.fromBoardString(testBoardStr,target)
            const nextP = board.determineNextPlayer()
            console.log("NEXT PLAYER: ",nextP)
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
            {/* <button className="btn btn-success" onClick={() => handleEvaluateBoard(1)}>Evaluate For X</button>
            <button className="btn btn-success" onClick={() => handleEvaluateBoard(-1)}>Evaluate For O</button> */}
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