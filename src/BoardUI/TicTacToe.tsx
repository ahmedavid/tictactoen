import React, { useEffect, useRef, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { IAction, IGameState } from '../utils/interfaces'
import { Canvas } from './Canvas'
import { PlayerIndicator } from './PlayerIndicator'
import './TicTacToe.css'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let canvas: HTMLCanvasElement | null

type IGameProps = {
    gameState: IGameState,
    nextPlayer: number,
    canPlay: boolean
    requestAIMove: () => Promise<void>
    refresh: () => void
    sendDepth: (depth: number) => void
}

function getPosFromCoords(xCoord:number, yCoord: number,n:number) {
    const y = Math.floor(xCoord / (CANVAS_WIDTH/n))
    const x = Math.floor(yCoord / (CANVAS_WIDTH/n))
    return {x,y}
}

export const TicTacToe = (
    {
        canPlay,
        gameState,
        nextPlayer,
        requestAIMove,
        refresh,
        sendDepth
    }: IGameProps) => {
    const [depth,setDepth] = useState(6)
    // const [isAI,setIsAI] = useState(false)
    // const [isAIBusy,setIsAIBusy] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    // const aimove = (gameState: IGameState) => {
    //     const {x,y} = game.getBestMove()
    //     game.move(1,{x:y,y:x})
    // }  

    const handleAIMove = async () => {
        await trackPromise(requestAIMove())
    }

    const handleClick = (e:MouseEvent,n: number) => {
        // const {x,y} = getPosFromCoords(e.offsetX,e.offsetY,n)
        // move(x,y)
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
                        if(gameState[y][x] === -1) {
                            canvasRenderer.drawX(x,y)
                        }
                        else if(gameState[y][x] === 1) {
                            canvasRenderer.drawO(x,y)
                        }
                    }
                }
            }
        
            renderGame(gameState)
            sendDepth(depth)
        }
    },[gameState])

    return (
        <div className="game_container">
            <div>
                <h1 className="inline_header">TTT Viewer</h1>
            </div>
            <PlayerIndicator player={nextPlayer === 1 ? "O" : "X"}/>
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
            <div className="row">
                <div className="col-4">
                    <select name="depth" id="depth" value={depth} onChange={e => {
                            const newDepth = parseInt(e.target.value)
                            setDepth(newDepth)
                            sendDepth(newDepth)
                        }}>
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={20}>20</option>
                        </select>
                </div>
                <div className="col-4">
                    <button className="btn btn-success btn-block" onClick={handleAIMove} disabled={!canPlay}>Agent</button>
                </div>
                <div className="col-4">
                    <button className="btn btn-warning btn-block" onClick={refresh} >Refresh Board</button>
                </div>
            </div>
        </div>
    )
}
