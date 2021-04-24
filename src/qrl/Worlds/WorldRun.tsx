import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QAgent } from '../../AI/QAgent'
import { QEnv } from '../../AI/QEnv'
import { APIClient, IDirection, IMoveStatus } from '../../utils/APIClient'
import { WorldCanvas } from './WorldCanvas'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800

let agent: QAgent
let qEnv: QEnv
let renderer: WorldCanvas
let timeId: NodeJS.Timeout

interface ParamTypes {
    worldId: string
}

interface IProps {
    apiClient: APIClient
    teamId: number
}

export const WorldRun = ({apiClient,teamId}:IProps) => {
    const {worldId} = useParams<ParamTypes>()
    const [traversing,setTraversing]= useState(false)
    const [score,setScore] = useState(0)
    const [seconds,setSeconds] = useState(15)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleMove = async () => {
        const reward = await agent.step()
        const {x,y} = agent.pos
        renderer.clearBoard()
        renderer.drawBoard()
        renderer.drawAgent(x,y)
        qEnv.drawRewards()
    }

    const handleTraverse = () => {
        clearInterval(timeId)
        setTraversing(true)
        timeId = setInterval(() => {
            handleMove()
        },seconds*1000)
    }

    const handleStopTraverse = () => {
        clearInterval(timeId)
        setTraversing(false)
    }

    const handleGetReward = async (dir: IDirection): Promise<IMoveStatus|undefined> => {
        console.log('TRY Dir: ', dir)
        const data = await apiClient.agentMove('0',teamId,dir)
        if(data) {
            return data
        }
    }

    const initRun = async () => {
        const loc = await apiClient.getLocation()
        const [xStr,yStr] = loc.state.split(':')
        const x = parseInt(xStr)
        const y = parseInt(yStr)

        qEnv = await QEnv.initEnvironment(worldId,40,renderer,apiClient)
        agent = new QAgent({x,y},qEnv,handleGetReward)
        renderer.drawAgent(x,y)
    }

    const handleUnload = (ev:BeforeUnloadEvent) => {
        ev.returnValue = 'Q Matrix is not saved'
    }

    const getInterval = () => {
        return (
            <div>
                <span>Delay:</span>
                <select name="interval" id="interval" value={seconds} onChange={e => setSeconds(parseInt(e.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </div>
        )
    }

    useEffect(() => {
        // window.addEventListener('beforeunload', handleUnload)
        const canvas = canvasRef.current
        if(canvas) {
            const ctx = canvas.getContext('2d')!
            renderer = new WorldCanvas(ctx,40,40)
            renderer.drawBoard()
        }
        initRun()
        // apiClient.getRuns().then(r => console.log(r))
        return () => {
            clearInterval(timeId)
            qEnv.onDestroy()
            renderer.clearBoard()
        }
    }, [])
    return (
        <div style={{display: 'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',marginTop:'20px',position:'relative'}}>
            <div className="compass" style={{position:'absolute', border:'1px solid black',top:'-10px',left:'20px', padding:'5px'}}>
                <span>&larr;S </span>
                <span>N&rarr;</span>
                <br/>
                <span>&darr; E   </span>
                <span>W &uarr;</span>
                <span style={{display:'block'}}>{seconds}</span>
            </div>
            <div>
                <Link className="btn btn-warning" to='/qrl'>Back</Link>
                {!traversing && <button className="btn btn-primary" onClick={() => qEnv.onDestroy()}>Save State</button>}
            </div>
            <div>
                <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} style={{margin:'12px'}}></canvas>
            </div>
            <div>
                {!traversing && <button className="btn btn-primary" onClick={handleMove}>Move</button>}
                {!traversing &&<button className="btn btn-success" onClick={handleTraverse}>Traverse</button>}
                {!traversing && getInterval()}
                {traversing &&<button className="btn btn-warning" onClick={handleStopTraverse}>Stop</button>}
            </div>
        </div>
    )
}