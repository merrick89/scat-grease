import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Layout from './templates/Layout';
import Home from './components/Home.js';
import Room from './components/Room.js';

class App extends Component {
  render(){
    return (
      <Layout>
        <Switch>
          <Route path={"/room/:game/:roomCode?"} render={(props)=> <Room key={props.match.params.roomCode} game={props.match.params.game} roomCode={props.match.params.roomCode} />}/>
          <Route path={"/"} render={(props)=> <Home history={props.history} />} />
        </Switch>
      </Layout>
    )
  }
}

export default App;