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

    getPlayerAnswers = (answerArrayIndex, playerList) => {
        // Loop through each player, and get their answer for index + 1
        const answerNumber = answerArrayIndex + 1;

        const response = playerList.map( player => {
            const object = {
                name: player.name,                
                answer: Object.keys(player.answers).length ? player.answers[answerNumber].answer : '',
                score: Object.keys(player.answers).length ? player.answers[answerNumber].score : 0
            }
            return (
                <tr key={object.name}>
                    <td>{object.name}</td>
                    <td align="left">{object.answer}</td>
                    <td>
                        <button className="btn btn-success btn-sm" onClick={() => {this.scoreAnswer(true, object.name, answerNumber)}}>Yee</button> &nbsp;
                        <button className="btn btn-danger btn-sm" onClick={() => {this.scoreAnswer(false, object.name, answerNumber)}}>Naw</button> &nbsp;
                        {object.score}
                    </td>
                </tr>
            )
        })

        return response
    }

    scoreAnswer = (direction, nickName, answerNumber) => {
        
        // Increase the individual question score.
        // Increase the player's overall score by the same amount.

        fetch(`${process.env.REACT_APP_API_URL}/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickName: nickName,
                roomCode: this.props.roomCode,
                direction: direction,
                answerNumber: answerNumber
            })
        })
        .then(res => res.json())
        .then(result => {
            if (result["success"] === true) {                
            // Answer scored
            console.log("Answer scored.")
        }})
        .catch(error => {
            console.log(error)
        });

    }

    render() { 

        const {letter, questions, playerList } = this.props;

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
                        <button onClick={this.startGame} className="btn btn-info mb-3">Play again</button>                        
                        <div className="text-left">
                            {
                                questions.map( (question, index) => (
                                    <div key={index} className="card w-100 bg-dark mb-3">
                                        <div className="card-header font-weight-bold">{index+1}. {question.text}</div>
                                        <div className="card-body p-0">
                                            <table className="table table-striped table-dark m-0 p-0">
                                                <thead>
                                                    <tr className="text-warning">
                                                        <td>Player</td>
                                                        <td>Answer</td>
                                                        <td>Score</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { this.getPlayerAnswers(index, playerList) }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <button onClick={this.startGame} className="btn btn-info">Play again</button>
                    </div>
                }
            </div>
        );
    }
}
 
export default Scatgrease;