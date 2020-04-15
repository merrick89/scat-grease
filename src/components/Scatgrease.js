import React, { Component } from 'react';
import Cookies from 'universal-cookie';

class Scatgrease extends Component {

    state = {
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        answer5: '',
        answer6: '',
        answer7: '',
        answer8: '',
        answer9: '',
        answer10: '',
        answer11: '',
        answer12: '',
    }

    componentDidUpdate(prevProps){
        if(prevProps.status !== this.props.status){
            if(this.props.status === 'end'){
                // Game has ended, submit the data
                this.submitData();
            } else if (this.props.status === 'playing'){
                // A game has started, wipe the state
                this.setState({
                    answer1: '',
                    answer2: '',
                    answer3: '',
                    answer4: '',
                    answer5: '',
                    answer6: '',
                    answer7: '',
                    answer8: '',
                    answer9: '',
                    answer10: '',
                    answer11: '',
                    answer12: '',
                })
            }
        }        
    }

    startGame = () => {
        // Hit the endpoint to startGame
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
                // Game started.
                console.log("Game started.")

            }})
            .catch(error => {
                console.log(error)
            });
    }

    submitData = () => {        

        // POST request to /scatGrease/answer
        const cookies = new Cookies();
        var nickName;

        if (cookies.get("nickName")){
            nickName = cookies.get("nickName");
        }

        fetch(`${process.env.REACT_APP_API_URL}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickName: nickName,
                roomCode: this.props.roomCode,
                answers: {
                    answer1: this.state.answer1,
                    answer2: this.state.answer2,
                    answer3: this.state.answer3,
                    answer4: this.state.answer4,
                    answer5: this.state.answer5,
                    answer6: this.state.answer6,
                    answer7: this.state.answer7,
                    answer8: this.state.answer8,
                    answer9: this.state.answer9,
                    answer10: this.state.answer10,
                    answer11: this.state.answer11,
                    answer12: this.state.answer12
                }
            })
        })
        .then(res => res.json())
        .then(result => {
            if (result["success"] === true) {                
            // Answers submitted

            console.log("Answers submitted.")
        }})
        .catch(error => {
            console.log(error)
        });
    }

    updateAnswer = (event) => {

        const target = event.target;
        const id = `answer${parseInt(target.id)+1}`;
        const value = target.value;
        
        this.setState({
            ...this.state,
            [id]: value
        })
    }

    render() { 

        const {letter, questions } = this.props;

        return (             
            <div>
                { this.props.status === "playing"
                ?
                    <React.Fragment>
                    <h1 className="alert alert-success">{letter}</h1>                    
                    <form className="text-left">
                        {
                            questions.map( (question, index) => (
                                <div key={index} className="form-group mb-4">
                                    <label className="font-weight-bold">{index+1}. {question.text}</label>
                                    <input id={index} type="text" className="form-control bg-dark border-0 text-white" onChange={(e) => {this.updateAnswer(e)}} />
                                </div>
                            ))
                        }
                    </form>
                    </React.Fragment>
                : this.props.status === "new" ?
                    <div className="m-3">
                        <button onClick={this.startGame} className="btn btn-info">Start a new game</button>
                    </div>
                :
                    <div>
                        Show everyone's answers.<br />
                        Let people score.<br />

                        <button onClick={this.startGame} className="btn btn-info">Play again</button>
                    </div>
                }
            </div>
        );
    }
}
 
export default Scatgrease;