import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Scatgrease from './Scatgrease';
import Cookies from 'universal-cookie';
import Countdown from 'react-countdown';
import moment from 'moment';

class Room extends Component {

  state = {
    game: this.props.game,
    connected: false,
    success: false,
    data: {
      roomCode: this.props.roomCode,
      playerList: []
    }    
  }

  componentDidMount(){

    const cookies = new Cookies();
    var nickName;

    if (cookies.get("nickName")){
      nickName = cookies.get("nickName");
    } else {
      // If no nickname cookie... move them to the home page so they have to re-enter..
      // But we can set the roomName cookie, so it's pre-filled
      cookies.set('roomCode', this.props.roomCode, { path: '/', expires: new Date(Date.now()+3600000)});
      this.props.history.push(`/`);
      return;
    }

    // Join the room. POST request to /scatGrease/join
    fetch(`${process.env.REACT_APP_API_URL}/join`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomCode: this.state.data.roomCode,
        nickName: nickName
      })
    })
      .then(res => res.json())
      .then(result => {
          if (result["success"] === true) {
            console.log("Joined room.")
          } 
      }).catch(error => {
          console.log(error)
      });

    // We need to have a roomCode, and a cookie with the name to be in here.
    const socket = socketIOClient(process.env.REACT_APP_GAME_URL); 
    
    socket.on("connect", () => {
      console.log(this.state.data.roomCode)
      socket.emit("clientConnected", this.state.data.roomCode)

      socket.on("FromAPI", data => { 
        this.setState({
          ...this.state,
          connected: true,
          success:data.success,
          data: data,
          nickName: nickName
        }) 
      })

      socket.on("disconnect", () => {
        this.setState({connected: false, success: false, data: false})         
      })

    })

  }

  render() {
    const { connected, success, data } = this.state;    
    return (
      <div style={{ textAlign: "center" }}>
        { connected 
          ?
            <React.Fragment>
              {success
                ? <React.Fragment>
                    {data
                    ? <div className="d-flex flex-wrap">
                        <div style={{flex: 3}}>
                          <h3>Room Code: {data.roomCode} / You: {this.state.nickName}</h3>
                          <div className="position-relative">
                            <div className="alert alert-info mb-0 p-1 mobile-countdown">
                              <Countdown date={moment(data.timeStarted).add(process.env.REACT_APP_SECONDS_PER_ROUND, 'seconds').format()} />
                            </div>
                          </div>
                          <Scatgrease roomId={data.roomId} roomCode={data.roomCode} letter={data.letter} questions={data.questions} timeStarted={data.timeStarted} status={data.status} playerList={data.playerList} />
                        </div>
                        <div className="ml-3 infoTab" style={{flex: 1}}>
                          <div className="card bg-dark position-sticky sticky-card">
                            <div className="card-header font-weight-bold">Players</div>
                            <div className="card-body m-0 p-0">
                              <table className="table table-striped table-dark m-0">
                                <tbody>
                                  {this.state.data.playerList.map((player, index) => (                                    
                                    <tr key={player.name}>
                                      <td>{index+1}.</td>
                                      <td align="left">{player.name}</td>
                                      <td>{player.score}</td>
                                    </tr>
                                  ))}
                                </tbody>                              
                              </table>
                            </div>
                            <div className="card-footer font-weight-bold countdown-custom">
                              <div className="alert alert-info mb-0 p-1">
                                { data.status === 'playing' ?
                                    <Countdown date={moment(data.timeStarted).add(process.env.REACT_APP_SECONDS_PER_ROUND, 'seconds').format()} />
                                  :
                                    <div className="text-center">00:00:00:00</div>
                                }
                              </div>                          
                            </div>
                          </div>
                        </div>
                      </div>
                    : <p>Searching for Room...</p>
                    }
                  </React.Fragment>
                :
                  <p>This room doesn't exist!</p>
              }
            </React.Fragment>
          : 
            <p>Connecting...</p>
          }
          
      </div>
    );
  }
}

export default Room