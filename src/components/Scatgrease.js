import React, { Component } from 'react';

class Scatgrease extends Component {

    state = {
        started: false
    }

    startGame = () => {
        //  Hit the endpoint to startGame
        // POST request to /scatGrease/create
    fetch(`${process.env.REACT_APP_API_URL}/startGame`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode: this.props.roomCode
        })
    })
        .then(res => res.json())
        .then(result => {
            if (result["success"] === true) {
              // Set state to started
              this.setState({started: true})
            } 
        }).catch(error => {
            console.log(error)
        });
        
    }

    render() { 
        const {letter, questions} = this.props;
        return (             
            <div>
                { this.state.started
                ?
                    <React.Fragment>
                    <h1 class="alert alert-success">{letter}</h1>
                    <form className="text-left">
                        {
                            questions.map( (question, index) => (
                                <div className="form-group mb-4">
                                    <label className="font-weight-bold">{index+1}. {question.text}</label>
                                    <input type="text" className="form-control bg-dark border-0 text-white"  />
                                </div>
                            ))
                        }
                    </form>
                    </React.Fragment>
                :
                    <div>
                        <button onClick={this.startGame} className="btn btn-info">Start Game</button>
                    </div>
                }
            </div>
        );
    }
}
 
export default Scatgrease;