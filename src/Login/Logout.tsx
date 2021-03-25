import React from 'react'
import { DB_STR } from './GameLogin'
import { useHistory } from 'react-router-dom';



export const Logout = () => {
    const history = useHistory()

    const logout = () => {
        localStorage.setItem(DB_STR, "")
        history.push('/game/login')
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <span>My TeamId: {}</span>
            <button className="btn btn-warning" onClick={logout}>Logout</button>
        </div>
    )
}