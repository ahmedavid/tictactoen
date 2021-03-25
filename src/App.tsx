import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { GameDetail } from './Games/GameDetail';
import { GameList } from './Games/GameList';
import { DB_STR, GameLogin } from './Login/GameLogin';
import { Navbar } from './Login/Navbar';
import { APIClient } from './utils/APIClient';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiClient = APIClient.getInstance()

interface IAppState {
  isLoggedin: boolean
  teamId: number
  userId: number
}

const INIT_APPSTATE: IAppState = {
  isLoggedin: false,
  teamId: 0,
  userId: 0
}

interface ILoginData {
  userId: number
  teamId: number
}

const checkLogin = (): Promise<{status: boolean, userId:number, teamId: number}> => {
  return new Promise((res,rej) => {
    const data = localStorage.getItem(DB_STR)
    if(data) {
      const {userId, teamId}: ILoginData = JSON.parse(data)
      if(userId && teamId)
        res({
          status: true,
          userId,
          teamId
        })
    }

    return rej({status:false,userId:0,teamId:0})
  })
}

const App = () => {
  const [appState,setAppState] = useState<IAppState>(INIT_APPSTATE)

  const handleCheckLogin = async () => {
    console.log("Handle Check Login...")
    try {
      const result = await checkLogin()
      if(result.status) {
        setAppState({
          isLoggedin: true,
          userId: result.userId,
          teamId: result.teamId
        })
      }
    }
    catch(err) {
      //setAppState(INIT_APPSTATE)
    }
  }

  useEffect(() => {
    handleCheckLogin()
  },
  [])

  if(!appState.isLoggedin) {
    return <GameLogin checkLogin={handleCheckLogin}/>
  }

  return (
    <Router>
      <Navbar loginData={{teamId:appState.teamId,userId: appState.userId}} checkLogin={handleCheckLogin}/>
      <ToastContainer/>
      <div className="App">
        <Switch>
          <Route path="/game/:team1Id/:team2Id/:gameId">
            <GameDetail apiClient={apiClient}/>
          </Route>
          <Route path="/games">
            <GameList apiClient={apiClient} team={appState.teamId}/>
          </Route>
          <Route path="*" >
            <Redirect to="/games"/>
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
