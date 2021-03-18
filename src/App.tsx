import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { GameDetail } from './Games/GameDetail';
import { GameList } from './Games/GameList';
import { GameLogin } from './Login/GameLogin';
import { APIClient } from './utils/APIClient';

const apiClient = APIClient.getInstance()

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/game/login">
            <GameLogin/>
          </Route>
          <Route path="/game/:team1Id/:team2Id/:gameId">
            <GameDetail apiClient={apiClient}/>
          </Route>
          <Route path="/game">
            <GameList apiClient={apiClient}/>
          </Route>
          <Route path="/" >
            <Redirect to="/game"/>
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
