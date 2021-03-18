import React, { useEffect, useRef } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { IAction, IGameState } from '../AI/Game'
import { Canvas } from './Canvas'
import { PlayerIndicator } from './PlayerIndicator'
import './TicTacToe.css'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let canvas: HTMLCanvasElement | null

type IGameProps = {
    move: Function,
    gameState: IGameState,
    nextPlayer: number,
    requestAIMove: () => Promise<IAction>
}

function getPosFromCoords(xCoord:number, yCoord: number,n:number) {
    const x = Math.floor(xCoord / (CANVAS_WIDTH/n))
    const y = Math.floor(yCoord / (CANVAS_WIDTH/n))
    return {x,y}
}

export const TicTacToe = ({move,gameState,nextPlayer,requestAIMove}: IGameProps) => {
    // const [isAI,setIsAI] = useState(false)
    // const [isAIBusy,setIsAIBusy] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    // const aimove = (gameState: IGameState) => {
    //     const {x,y} = game.getBestMove()
    //     game.move(1,{x:y,y:x})
    // }  

    const handleAIMove = async () => {
        const {x,y} = await trackPromise(requestAIMove())
        console.log("AI MOVE:" ,x,y)
        move(x,y)
    }

    const handleClick = (e:MouseEvent,n: number) => {
        const {x,y} = getPosFromCoords(e.offsetX,e.offsetY,n)
        move(x,y)
    }

    const n = gameState!.length
    useEffect(() => {
        canvas = canvasRef.current
        if(canvas) {
            // canvas.addEventListener('click', e=> handleClick(e,n), false)
    
            const ctx = canvas.getContext('2d')!
            const canvasRenderer = new Canvas(ctx , CANVAS_WIDTH, CANVAS_HEIGHT,n,n)
            canvasRenderer.drawBoard()
        
            const renderGame = (gameState: IGameState) => {
                const n = gameState.length
                for(let y = 0;y<n;y++) {
                    for(let x = 0;x<n;x++) {
                        if(gameState[y][x] === 1) {
                            canvasRenderer.drawX(x,y)
                        }
                        else if(gameState[y][x] === -1) {
                            canvasRenderer.drawO(x,y)
                        }
                    }
                }
            }
        
            renderGame(gameState)
        }
    },[gameState])

    return (
        <div className="game_container">
            <div>
                <h1 className="inline_header">TTT Viewer</h1>
            </div>
            <PlayerIndicator player={nextPlayer === 1 ? "X" : "O"}/>
            <div className="spacer"></div>
            <div>
                <canvas 
                    width={CANVAS_WIDTH} 
                    height={CANVAS_HEIGHT} 
                    ref={canvasRef} 
                    style={{display:'block'}} 
                    onClick={e => {
                        handleClick(e.nativeEvent,n)
                    }
                }></canvas>
            </div>
            <div className="spacer"></div>
            <div>
                <button className="btn btn-success btn-block" onClick={handleAIMove}>Request AI Move</button>
            </div>
        </div>
    )
}
