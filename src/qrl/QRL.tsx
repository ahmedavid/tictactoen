import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { APIClient } from '../utils/APIClient'
import { Worlds } from './Worlds/Worlds'

interface IProps {
    apiClient: APIClient
    teamId: number
}


export const QRL = ({apiClient, teamId}:IProps) => {
    const history = useHistory()
    const [world,setWorld] = useState('-1')
    const init = async () => {
        const location = await apiClient.getLocation()
        console.log("LOC UI: ", location)
        setWorld(location.world)
    }

    useEffect(() => {
        init()
        
    }, [])

    const handleEnterWorld = async (worldId: string) => {
        if(await apiClient.enterWorld(worldId,teamId)) {
            history.push('/qrl/world/'+worldId)
        }
    }

    const handleContinueWorld = (worldId: string) => {
        history.push('/qrl/world/'+worldId)
    }

    return (
        <div className="container">
            <Worlds teamId={teamId} currentWorld={world} enterWorld={handleEnterWorld} continueWorld={handleContinueWorld}/>
        </div>
    )
}