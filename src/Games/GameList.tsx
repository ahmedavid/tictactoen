import React, { useEffect, useState } from 'react'
import './GameList.css'
import { useHistory } from 'react-router-dom';
import { IGame,APIClient } from '../utils/APIClient';
import { CreateGameForm } from './CreateGameForm';

interface IProps {
    apiClient: APIClient
    team: number
}

export const GameList = ({apiClient,team}: IProps) => {
    const history = useHistory();
    const [gameList,setGameList] = useState<IGame[]>([])

    const getGameList = async () => {
        let glist = await apiClient.gameList()
        glist.reverse()
        glist = [{test:"1243:1246:test"}, ...glist]
        setGameList(glist)
    }

    const createGame = async (team1Id:number, team2Id: number,boardSize: number, target: number) => {
        await apiClient.createGame(team1Id,team2Id,boardSize,target)
        getGameList()
    }

    const renderGameList = () => {
        if(gameList.length === 0) 
            return <p>No Games Yet!!!</p>
        return (
            <ul className="list-group mt-4 mb-4">
                {
                    gameList.map((g,i) => {
                        const gameId = Object.keys(g)[0]
                        const data = g[gameId]
                        const dataArr = data.split(":")
                        const team1Id = dataArr[0]
                        const team2Id = dataArr[1]
                        const isOpen = data.endsWith("O") 
                        return <li 
                                style={{backgroundColor:isOpen ? "#28a745" :"#dc3545"}} 
                                key={gameId+i} id={gameId} 
                                className="list-group-item game_list_item" 
                                onClick={e => history.push(`/game/${team1Id}/${team2Id}/${gameId}`)}>ID:{gameId} - {g[gameId]}</li>
                    })
                }
            </ul>
        )
    }

    useEffect(() => {
        getGameList()
    },[])

    return (
        <div className="game_list container">
            <CreateGameForm createGame={createGame} team1Id={team}/>
            <hr/>
            <h1>My Games</h1>
            {renderGameList()}
        </div>
    )
}