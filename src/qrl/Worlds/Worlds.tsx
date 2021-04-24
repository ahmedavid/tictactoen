import React from 'react'
import { World } from './World'
import './Worlds.css'

interface IProps {
    teamId: number,
    currentWorld: string,
    enterWorld: (worldId:string) => void
    continueWorld: (worldId:string) => void
}

const worldsArr = ['0','1','2','3','4','5','6','7','8','9','10']

export const Worlds = ({teamId,currentWorld,enterWorld,continueWorld}: IProps) => {
    const worldsList = worldsArr.map(w => {
        return <World key={w} current={w === currentWorld} worldId={w} enterWorld={() => enterWorld(w)} continueWorld={() => continueWorld(w)}/>
    })
    return (
        <div>
            <h1>Worlds</h1>
            <div className="worlds_container">
                { worldsList }
            </div>
        </div>
    )
}