import React, { useEffect, useRef } from 'react'
import { QTestAgent } from './QTestAgent'
import { QTestCanvas } from './QTestCanvas'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400

// const world = [
//     [ -0.1, -0.1, -0.1, -0.1],
//     [ -0.1, -0.1, -0.1, -0.1],
//     [ -0.1, -0.1,    1, -0.1],
//     [ -0.1, -0.1, -0.1, -0.1],
// ]

const world = [
    [ -0.1, -0.1, -0.1, -0.1, -0.1],
    [ -0.1, -0.1, -0.1, -0.1, -0.1],
    [ -0.1, -0.1, -0.1, -0.1, -0.1],
    [ -0.1, -0.1, 1, -0.1, -0.1],
    [ -0.1, -0.1, -0.1, -0.1, -0.1],
]



let renderer: QTestCanvas

export const QTest = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const handleMove = () => {
    }
    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas) {
            const ctx = canvas.getContext('2d')!
            const rows = world.length
            const cols = world[0].length
            renderer = new QTestCanvas(ctx,rows,cols)
            renderer.drawBoard()

            const handleGetReward = (x:number,y:number) => {
                return world[x][y]
            }

            let agent = new QTestAgent(rows,{x:0,y:0},handleGetReward)
            let stop = false
            for(let i=0;i<1000;i++) {
                const reward = agent.step()
            }
            // agent.train()
            // agent.move()
            console.log(agent)
            agent.traverse()
        }

        return () => {
            renderer.clearBoard()
        }
    }, [])
    return (
        <div style={{display: 'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginTop:'50px'}}>
            <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} style={{margin:'12px'}}></canvas>
            <button className="btn btn-primary" onClick={handleMove}>Train</button>
        </div>
    )
}