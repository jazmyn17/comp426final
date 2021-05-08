import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import './index.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: ["r", "g", "y", "b", "o", "p"],
            sequence: [], 
            userInput: [],
            level: 1,
            isShowingSequence: false,
            isPlaying: false,
            gameStarted: false,
            gameOver: false,
            flash: ["", "", "", "", "", ""],
            showShareOptions: false
        }
    }
    //API 1 (I think. If not I have more below)
    audio = new Audio("http://www.stdimension.org/MediaLib/effects/computer/federation/keyok4.wav"); 
    audio1 = new Audio("http://www.stdimension.org/MediaLib/effects/computer/federation/keyok4.wav"); 
    audio2 = new Audio("http://www.stdimension.org/MediaLib/effects/computer/federation/keyok4.wav"); 
    audio3 = new Audio("http://www.stdimension.org/MediaLib/effects/computer/federation/keyok4.wav");
    audio4 = new Audio("http://www.stdimension.org/MediaLib/effects/computer/federation/keyok4.wav");
    audio5 = new Audio("http://www.stdimension.org/MediaLib/effects/computer/federation/keyok4.wav");

    level_counter = 1;
    gameIsStarted = false;
    getFact = true;
    soundON = true;
    //showShareOptions = false;

    renderColors(i) {
        return (
          <button
            id='colorButton'
            className={[this.state.colors[i], this.state.flash[i]].join(" ")}
            disabled={this.state.isPlaying === false}
            onClick={() => this.handleClick(i)}
           />
         );
    }

    CreateSequence() {
        for(let i=0; i < 50; i++) {
            var x = Math.floor(Math.random() * 6);
            this.state.sequence[i] = x;
        }
    }

    startGame() {
        this.CreateSequence();
        this.setState({gameStarted: true});
        this.gameIsStarted = true;
        this.playSequence();
    }

    playSequence() {
        this.setState({userInput: []});
        var show = this.state.sequence.slice(0,this.level_counter);
        this.flashColors(show);
    }

    async flashColors(arr) {
        const timeout = function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        for(var i = 0; i < arr.length; i++) {
            if (this.gameIsStarted === false) {
                //break;
                this.restartGame();
                break;
            }
            await timeout(500);
            if (arr[i] === 0) {
                if (this.soundON) {
                    this.audio.play();
                }
                this.setState({flash: ["active","","","","",""]});
            } else if (arr[i] === 1) {
                if (this.soundON) {
                    this.audio1.play();
                }
                this.setState({flash: ["","active","","","",""]});
            } else if (arr[i] === 2) {
                if (this.soundON) {
                    this.audio2.play();
                }
                this.setState({flash: ["","","active","","",""]});
            } else if (arr[i] === 3) {
                if (this.soundON) {
                    this.audio3.play();
                }
                this.setState({flash: ["","","","active","",""]});
            } else if (arr[i] === 4) {
                if (this.soundON) {
                    this.audio4.play();
                }
                this.setState({flash: ["","","","","active",""]});
            } else {
                if (this.soundON) {
                    this.audio5.play();
                }
                this.setState({flash: ["","","","","","active"]});
            } 
            await timeout(500);
            this.setState({flash: ["","","","","",""]});
        }
        this.setState({isShowingSequence: false});
        this.setState({isPlaying: true});
    }

    handleClick(guess) {
        if (guess === 0) {
            if (this.soundON) {
                this.audio.play();
            }
        } else if (guess === 1) {
            if (this.soundON) {
                this.audio1.play();
            }
        } else if (guess === 2) {
            if (this.soundON) {
                this.audio2.play();
            }
        } else if (guess === 3) {
            if (this.soundON) {
                this.audio3.play();
            }
        } else if (guess === 4) {
            if (this.soundON) {
                this.audio4.play();
            }
        } else {
            if (this.soundON) {
                this.audio5.play();
            }
        } 
        var seq = this.state.sequence.slice(0,this.level_counter);
        var guesses = [...this.state.userInput, guess];
        this.setState({userInput: guesses});
        for(var i = 0; i < guesses.length; i++) {
            if (guesses[i] !== seq[i]) {
                this.setState({gameOver: true});
                this.gameIsOver();
                return;
            }
            if (i  + 1 === guesses.length) {
                if (guesses.length === seq.length) {
                    this.setState({level: this.state.level + 1});
                    this.level_counter++;
                    this.setState({isShowingSequence: true});
                    this.setState({isPlaying: false});
                    this.playSequence();
                }
            }
        }
    }

    gameIsOver() {
        this.setState({gameStarted: false});
        this.setState({isPlaying: false});
        this.gameIsStarted = false;
        this.getRandomNumberFact();
        this.setState({showShareOptions: true});
    }

    getRandomNumberFact() {
        //API 2
        if (this.getFact === true) {
            $.get('//numbersapi.com/' + this.state.level + '/trivia?notfound=floor&fragment', function(data) {
            $('.randomNumberFact').text(data);
            });
            this.getFact = false;
        }
    }

    async shareToTwitter() {
        //API 3
        var shareText = "I made it to level " + this.state.level + " in Repeat After Me! See if you can beat me.";
        const result = await axios({
            method: 'post',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
            withCredentials: true,
            data: {
              body: shareText
            },
        });
        //this.restartGame();
        this.setState({showShareOptions: false})
    }

    restartGame() {
        this.setState({
            colors: ["r", "g", "y", "b", "o", "p"],
            sequence: [], 
            userInput: [],
            level: 1,
            isShowingSequence: false,
            isPlaying: false,
            gameStarted: false,
            gameOver: false,
            flash: ["", "", "", "", "", ""],
            showShareOptions: false
        });
        this.level_counter = 1;
        this.gameIsStarted = false;
        this.getFact = true;
        //this.showShareOptions = false;
    }

    render() {
        let status;
        if (this.state.gameOver === true) {
            status = "Game Over." //You made it to level " + this.state.level + " out of 50"
        } else {
            status = 'Level ' + this.state.level;
        }
        let shareTweetText = "I made it to level " + this.state.level + "! See if you can beat me.";
        return (
            <div className="game">
                {/* API 4 */}
                <iframe class="timeAndDate" src="https://free.timeanddate.com/clock/i7smqhie/n179/fcfff/tct/pc000/tt0/tw0/tm1/tb4" frameborder="0" width="87" height="34" allowtransparency="true"></iframe>
                <h1 className="title">{"Repeat After Me"}</h1>
                <h2 className= "instructions">{"Repeat the pattern that flashes!"}</h2>
                <h2 className="level">{status}</h2>
                <div className="game-board">
                    <div class="row">
                        {this.renderColors(0)}
                        {this.renderColors(1)}
                    </div>
                    <div class="middle">
                        {this.renderColors(2)}
                        {this.renderColors(3)}
                    </div>
                    <div class="row">
                        {this.renderColors(4)}
                        {this.renderColors(5)}
                    </div>
                </div>
                <button 
                    className="start" 
                    onClick= {() => this.startGame()}
                    disabled={this.state.gameStarted === true || this.state.gameOver === true}>Start</button>
                <button className="reset" onClick= {() => this.restartGame()}>Reset</button>
                <button className="sound" onClick= {() => this.soundON = !this.soundON}>Sound</button>
                <div class="factStart" hidden={this.getFact}>{"You made it to level " + this.state.level + ". Fun Fact: This is the same number as "} <span class="randomNumberFact"></span></div>
                <div class="shareResults">
                    <button className="share" hidden={this.state.showShareOptions === false} onClick= {() => this.shareToTwitter()}>Share To Twitter</button>
                    {/*<textarea class="textArea" hidden={this.state.showShareOptions === false}>{shareTweetText}</textarea>*/}
                </div>
            </div>
          );
    }

}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);