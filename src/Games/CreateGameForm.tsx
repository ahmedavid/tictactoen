import React, { useState } from 'react'

interface IProps {
    team1Id: number
    createGame: (teamId1: number, teamId2: number,boardSize: number, target: number) => void
}

const INITIAL_BOARDSIZE = 3

export const CreateGameForm = ({createGame, team1Id}: IProps) => {
    const [team2Id, setTeam2Id] = useState("")
    const [currBoardSize, setCurrBoardSize] = useState(INITIAL_BOARDSIZE)
    const [currTarget, setCurrTarget] = useState(INITIAL_BOARDSIZE)
    return (
        <form className="mt-8" onSubmit={e => {
            e.preventDefault()
            if(team2Id.length > 0)
                createGame(team1Id,parseInt(team2Id),currBoardSize,currTarget)
        }}>
            <div>
                <pre>
                        boardSize: {currBoardSize} <br/>
                        target: {currTarget}<br/>
                        team2: {team2Id}
                </pre>
            </div>
            <div className="form-group">
                <label htmlFor="opponentTeam">Opponet Team</label>
                <input 
                    type="number" 
                    id="opponentTeam" 
                    className="form-control" 
                    placeholder="1234" 
                    // value={team2Id} 
                    onChange={e => setTeam2Id(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="boardSize">Board Size</label>
                {/* <input type="text" id="boardSize" className="form-control" placeholder="6, 12"/> */}
                <select 
                    name="boardSize" 
                    id="boarSize" 
                    className="form-control" 
                    onChange={e => {
                        setCurrBoardSize(parseInt(e.target.value))
                        setCurrTarget(parseInt(e.target.value))
                    }}>
                    <option key={'bs' + 3} value={3}>3</option>
                    <option key={'bs' + 4} value={4}>4</option>
                    <option key={'bs' + 5} value={5}>5</option>
                    <option key={'bs' + 6} value={6}>6</option>
                    <option key={'bs' + 12} value={12}>12</option>
                    <option key={'bs' + 20} value={20}>20</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="target">Target</label>
                <select 
                    name="target" 
                    id="target" 
                    className="form-control" 
                    onChange={e => {
                        setCurrTarget(parseInt(e.target.value))
                    }}>
                    {
                        Array.from(new Array(currBoardSize)).map((x,i) => <option key={'target' + (currBoardSize-i)} value={currBoardSize-i}>{currBoardSize-i}</option>)
                    }
                </select>
            </div>

            <button className="btn btn-primary" type="submit" disabled={team2Id.length === 0}>Create New Game</button>
        </form>
    )
}