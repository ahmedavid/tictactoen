import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DB_STR, ILoginData } from './GameLogin'

interface IProps {
    loginData: ILoginData
    checkLogin: () => void
}

export const Navbar = ({loginData, checkLogin}: IProps) => {

    const {userId,teamId} = loginData

    const logout = () => {
        localStorage.removeItem(DB_STR)
        checkLogin()
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">TicTacToeN</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <Link  to='/games' className="nav-link" href="#">TTT</Link>
            </li>
            <li className="nav-item active">
                <Link  to='/qrl' className="nav-link" href="#">QRL <span className="sr-only">(current)</span></Link>
            </li>
            {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Something else here</a>
                </div>
            </li>
            <li className="nav-item">
                <a className="nav-link disabled" href="#">Disabled</a>
            </li> */}
            </ul>
            
            <div style={{color: "white", marginRight:"15px"}}>My TeamID: {teamId}</div>
            <div style={{color: "white", marginRight:"15px"}}>My UserID: {userId}</div>
            <div>
                <button className="btn btn-warning" onClick={logout}>Logout</button>
            </div>
            {/* <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form> */}
        </div>
        </nav>
    )
}