import React, { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker';
import './GameList.css'
import { useHistory } from 'react-router-dom';
import { ILoginData, isLoggedIn } from '../Login/GameLogin';
import { IGame,APIClient } from '../utils/APIClient';

interface IProps {
    apiClient: APIClient
}


let teamId1 = 1243
let teamId2 = 1246

export const GameList = ({apiClient}: IProps) => {
    const [loginData,setLoginData] = useState<ILoginData>({
        teamId: "",
        userId: "",
    })
    const history = useHistory();
    const [showTeam,setShowTeam] = useState(true)
    const [team,setTeam] = useState("HodriMeydan")
    const [gameList,setGameList] = useState<IGame[]>([])

    const getGameList = async () => {
        let glist = await trackPromise(apiClient.gameList())
        glist.reverse()
        setGameList(glist)
    }

    const createGame = async () => {
        await apiClient.createGame(teamId1,teamId2,6)
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
                        const isOpen = data.endsWith("O") 
                        return <li style={{backgroundColor:isOpen ? "#28a745" :"#dc3545"}} key={gameId+i} id={gameId} className="list-group-item game_list_item" onClick={e => history.push(`/game/${teamId1}/${teamId2}/${gameId}`)}>ID:{gameId} - {g[gameId]}</li>
                    })
                }
            </ul>
        )
    }

    useEffect(() => {
        isLoggedIn().then((loginData) => {
            if(loginData) {
                console.log(loginData)
                setLoginData(loginData)
            } else {
                history.push('/game/login')
                return
            }
        }).catch(() => {
            history.push('/game/login')
            return
        })
        getGameList()
        console.log(loginData)
    },[])

    return (
        <div className="game_list container">
            <h3 onDoubleClick={e => setShowTeam(false)} style={{display: showTeam ? 'inline-block' : 'none'}}>{team}</h3><span>  (MyTeam)</span>
            <form onSubmit={e => {
                e.preventDefault()
                setShowTeam(true)
            }} style={{display: showTeam ? 'none' : 'block'}}>
                <div className="form-group">
                    <input type="text" id="myTeam" className="form-control" value={team} onChange={e => setTeam(e.target.value)}/>
                </div>
            </form>

            <hr/>

            <form className="mt-8">
                <div className="form-group">
                    <label htmlFor="opponentTeam">Opponet Team</label>
                    <input type="text" id="opponentTeam" className="form-control" placeholder="1234"/>
                </div>
                <div className="form-group">
                    <label htmlFor="boardSize">Board Size</label>
                    <input type="text" id="boardSize" className="form-control" placeholder="6, 12"/>
                </div>

                <button className="btn btn-primary" onClick={createGame}>Create New Game</button>
            </form>
            <hr/>
            <h1>My Games</h1>

            {renderGameList()}


        </div>
    )
}