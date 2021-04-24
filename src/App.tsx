import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { GameDetail } from './Games/GameDetail';
import { GameList } from './Games/GameList';
import { DB_STR, GameLogin } from './Login/GameLogin';
import { Navbar } from './Login/Navbar';
import { APIClient } from './utils/APIClient';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Test } from './Games/Test';
import { QRL } from './qrl/QRL';
import { WorldRun } from './qrl/Worlds/WorldRun';
import { QTest } from './qtest/QTest';

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
      setAppState(INIT_APPSTATE)
    }
  }

  useEffect(() => {
    handleCheckLogin()
  },[])

  // return (
  //   <Test/>
  // )

  if(!appState.isLoggedin) {
    return <GameLogin checkLogin={handleCheckLogin}/>
  }

  return (
    <Router>
      <Navbar loginData={{teamId:appState.teamId,userId: appState.userId}} checkLogin={handleCheckLogin}/>
      <ToastContainer/>
      <div className="App">
        <Switch>
          <Route exact path="/qtest">
            <QTest/>
          </Route>
          <Route exact path="/qrl">
            <QRL apiClient={apiClient} teamId={appState.teamId}/>
          </Route>
          <Route exact path="/qrl/world/:worldId">
            <WorldRun apiClient={apiClient} teamId={appState.teamId}/>
          </Route>
          <Route exact path="game/test/test/test">
            <GameDetail apiClient={apiClient} teamId={appState.teamId}/>
          </Route>
          <Route path="/game/:team1Id/:team2Id/:gameId">
            <GameDetail apiClient={apiClient} teamId={appState.teamId}/>
          </Route>
          <Route exact path="/games">
            <GameList apiClient={apiClient} team={appState.teamId}/>
          </Route>

          <Route path="*" >
            <Redirect to="/qrl"/>
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
