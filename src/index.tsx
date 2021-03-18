import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { usePromiseTracker } from "react-promise-tracker";

import {
  BrowserRouter as Router,
} from "react-router-dom";
import Loader from 'react-loader-spinner';


 const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker()
    
    return (
      <div
        style={{
          zIndex:100,
          position: "absolute",
          top:0,
          left:0,
          bottom:0,
          right:0,
          backgroundColor: "#00000080",
          width: "100%",
          height: "100%",
          display: promiseInProgress? "flex" : "none",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
      </div>
    );  
  }

  ReactDOM.render(
    <Router>
        <React.StrictMode>
          <div style={{position:"relative",width:"100%",height:"100%"}}>
            <LoadingIndicator/>
            <App/>
          </div>
        </React.StrictMode>
    </Router>,
    document.getElementById('root')
  );
