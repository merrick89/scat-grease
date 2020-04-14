import React, { Component } from 'react';

class Scatgrease extends Component {

    state = {
        started: false
    }

    startGame = () => {
        //  Hit the endpoint to startGame
        this.setState({started: true})
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
                            questions.map( question => (
                                <div className="form-group mb-4">
                                    <label className="font-weight-bold">{question.text}</label>
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