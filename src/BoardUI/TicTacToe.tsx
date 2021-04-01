import React, { useEffect, useRef, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import {  IGameState } from '../utils/interfaces'
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
    const canvasRef = useRef<HTMLCanvasElement>(null)

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
                for(let row=0;row<n;row++) {
                    for(let col=0;col<n;col++) {
                        if(gameState[row][col] === 1) {
                            canvasRenderer.drawO(row,col)
                        }
                        if(gameState[row][col] === -1) {
                            canvasRenderer.drawX(row,col)
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
                            <option value={8}>8</option>
                            <option value={10}>10</option>
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
