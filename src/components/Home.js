import React, { Component } from 'react';
import warning from '../assets/images/warning.png';
import ReactToolTip from 'react-tooltip';
import Cookies from 'universal-cookie';
import newgame from '../assets/images/newgame.png';
import joingame from '../assets/images/joingame.png';

class Home extends Component {

  state = {
    nickName: '',
    roomCode: ''
  }

  componentDidMount(){
    const cookies = new Cookies();

    if (cookies.get("roomCode") || cookies.get("nickName")){
      const roomCode = cookies.get("roomCode") ? cookies.get("roomCode") : '';
      const nickName = cookies.get("nickName") ? cookies.get("nickName") : '';

      this.setState({
        roomCode: roomCode,
        nickName: nickName
      })
    }    
  }

  handleCreateNickname = (event) => {
    const target = event.target;
    const value = target.value;

    if (value.length > 0){
      this.setState({
        ...this.state,
        nickName: value
      })
    } else {
      this.setState({
        ...this.state,
        nickName: ''
      })
    }
   
  }

  handleJoinRoomCode = (event) => {
    const target = event.target;
    const value = target.value.trim();

    if (value.length > 0){
      this.setState({
        ...this.state,
        roomCode: value
      })
    } else {
      this.setState({
        ...this.setState({
          roomCode: ''
        })
      })
    }
   
  }

  createRoom = () => {
    // Create a new room in the DB 
    // POST request to /scatGrease/create
    fetch(`${process.env.REACT_APP_API_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickName: this.state.nickName
        })
    })
        .then(res => res.json())
        .then(result => {
            if (result["success"] === true) {
              // Grab the roomCode from the response             
              let roomCode = result.data.roomCode;
              // Set cookie for roomCode and nickName     
              const cookies = new Cookies();
              cookies.set('roomCode', roomCode, { path: '/', expires: new Date(Date.now()+3600000)});
              cookies.set('nickName', this.state.nickName, { path: '/', expires: new Date(Date.now()+3600000) });
              // Redirect to the room once it's been created
              this.props.history.push(`room/scat-grease/${roomCode}`);
            } 
        }).catch(error => {
            console.log(error)
        });    
  }

  joinRoom = () => {
    // Add the new player to the room (If it doesn't already exist)
    let { roomCode, nickName } = this.state;    

    // Set cookie for roomCode and nickName     
    const cookies = new Cookies();
    cookies.set('roomCode', roomCode, { path: '/', expires: new Date(Date.now()+3600000)});
    cookies.set('nickName', nickName, { path: '/', expires: new Date(Date.now()+3600000) });
    // Redirect to the room once it's been created
    this.props.history.push(`room/scat-grease/${roomCode}`);
  }

  render(){
    return(
      <React.Fragment>
        <div className="text-center p-3 mb-3">
          <div>
            <img className="icon" src={warning} alt="Warning! Adult themed game"/>
            <h3>WARNING</h3>
            <p>Adult themed game.</p>
            <p className="text-info pb-0 mb-0"><strong>Rules</strong>: You get <strong>1 letter</strong> and <strong>12 questions</strong>. Your answers must all start with the letter. You have <strong>2 minutes</strong>.</p>
          </div>
        </div>
        <div className="text-center p-3 mb-3" style={{backgroundColor:"RGBA(255,255,255,0.05)"}}>
          <ReactToolTip />          
          <div className="mb-3">
            <h4 className="mb-3">1. Choose a nickname</h4>
            <input type="text" className="form-control w-50 m-auto text-center bg-dark border-0 text-white" placeholder="Enter a nickname" onChange={(e) => this.handleCreateNickname(e)} value={this.state.nickName} />
          </div>          
        </div>
        <div className="text-center p-3" style={{backgroundColor:"RGBA(255,255,255,0.05)"}}>          
          <div className="d-flex justify-content-around align-items-center">            
            <div className="w-50 p-5 border-right">
              <h4>Create a Room</h4>
              <img className="display-block" src={newgame} alt="Create Game" /><br />
            { this.state.nickName
              ?
                <button className="btn btn-success" onClick={this.createRoom}>Create a Room</button>  
              :          
                <button className="btn btn-secondary" onClick={this.createRoom} disabled data-tip="Type in your name first!">Create a Room</button>          
            }
            </div>
            <div className="w-50 p-5">
              <h4>Join a Room</h4>
              <img className="display-block" style={{maxWidth: "100px"}} src={joingame} alt="Join Game" /><br />
              <div className="mb-3">
                <input type="text" className="form-control w-100 m-auto text-center bg-dark border-0 text-white" placeholder="Enter a room code" style={{maxWidth: "200px"}} onChange={(e) => this.handleJoinRoomCode(e)} value={this.state.roomCode} />
              </div>
              { this.state.nickName && this.state.roomCode
                ?
                  <button className="btn btn-success" onClick={this.joinRoom}>Join Room</button>
                :          
                  <button className="btn btn-secondary" onClick={this.joinRoom} disabled data-tip="Choose a nickname and room code.">Join Room</button>          
              }
              
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Home