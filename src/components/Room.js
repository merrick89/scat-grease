import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import Scatgrease from './Scatgrease';

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
          data: data
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
                    ? <div className="d-flex">
                        <div className="mr-3" style={{flex: 3}}>
                          <h3>Room Code: {data.roomCode}</h3>
                          <Scatgrease roomId={data.roomId} roomCode={data.roomCode} letter={data.letter} questions={data.questions} timeStarted={data.timeStarted} />
                        </div>
                        <div style={{flex: 1}}>
                          <div className="card bg-dark">
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