import React from 'react'
import './World.css'

interface IProps {
    worldId: string
    current: boolean
    enterWorld: () => void
    continueWorld: () => void
}


export const World = ({worldId,current,enterWorld,continueWorld}:IProps) => {
    const getClass = () => {
        return current ? 'world current-world' : 'world'
    }

    return (
        <div className={getClass()}>
            <div className="buttons">
                {!current && <button className='btn btn-primary btn-enter' onClick={enterWorld}>Enter</button>}
                {current && <button className='btn btn-success' onClick={continueWorld}>Continue</button>}
            </div>
            <span>{worldId}</span>
        </div>
    )
}