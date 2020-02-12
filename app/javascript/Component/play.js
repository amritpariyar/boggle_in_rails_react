import React, { Component } from "react";
import Axios from "axios";
import Randomize from "./randomize";
import PlayStop from "./playstop";
import NewGame from "./newgame";
import Cardboard from "./carboard";
import WordInput from "./wordinput";
import Submit from "./submit";

class Play extends Component {
  state = {
    charset: [],
    playstop: "Play",
    counterStart: false,
    timeRemained: this.playtime,
    scoreBoard: [],
    totalScore: 0,
    wordtyped: "",
    focus: true,
    gameStarting: false,
    infoMessage: ""
  };
  textInput = React.createRef();
  playtime = 120;
  timerId = 0;

  focusTextInput = () => {
    this.textInput.current.focus();
  };

  componentDidMount = () => {
    this.getRandomCharSet();
  };
  getRandomCharSet() {
    Axios.get("/randomchar.json")
      .then(data => {
        let charset = data.data;
        this.setState({ charset: charset });
      })
      .catch(err => {
        console.log(err);
      });
  }
  handleRandomWord = () => {
    this.getRandomCharSet();
  };
  handlePlayStop = () => {
    let counterStatus = this.state.counterStart;
    if (counterStatus) {
      clearInterval(this.timerId);
      this.setState({
        counterStart: false,
        timeRemained: 0,
        playstop: "Play",
        gameStarting: false,
        infoMessage: "Game is not starting, Press 'Play' botton"
      });
    } else {
      this.timerId = setInterval(this.timer.bind(), 1000);
      this.setState({
        counterStart: true,
        timeRemained: this.playtime,
        playstop: "Stop",
        gameStarting: true
      });
    }
  };

  handelNewGame = () => {
    this.setState({
      charset: [],
      playstop: "Play",
      counterStart: false,
      timeRemained: this.playtime,
      scoreBoard: [],
      totalScore: 0,
      wordtyped: "",
      focus: true,
      gameStarting: false,
      infoMessage: ""
    });
    this.getRandomCharSet();
  };

  timer = timerid => {
    this.setState({
      timeRemained: this.state.timeRemained - 1
    });
    if (this.state.timeRemained < 1) {
      clearInterval(this.timerId);
      this.setState({
        counterStart: false,
        playstop: "Play",
        gameStarting: false
      });
    }
  };
  getTimeRemained = () => {
    return this.state.timeRemained;
  };
  generateTable = () => {
    const { charset = [] } = this.state;
    const cols = 4,
      rows = 4;
    return Array.from({ length: rows }, (char, i) => (
      <tr key={i}>
        {charset.slice(i * cols, (i + 1) * cols).map((a, p) => (
          <td key={p}>{a}</td>
        ))}
      </tr>
    ));
  };

  scoreBoradData = () => {
    let scoreBoard = this.state.scoreBoard;
    return scoreBoard.map((item, i) => (
      <li key={i}>
        {item.word}, {item.score}
      </li>
    ));
  };
  setTotalScore = () => {
    let totalScore = 0;
    this.state.scoreBoard.map((item, i) => (totalScore += item.score));
    this.setState({ totalScore: totalScore });
  };

  handleTypedWord = evt => {
    if (this.state.gameStarting) {
      let value = evt.target.value;
      let checkedChar = this.checkValidCharsInTable(value);
      checkedChar
        ? this.setState({ wordtyped: value.toUpperCase() })
        : this.setState({ wordtyped: "" });
    }
  };

  checkValidCharsInTable = checkWord => {
    let isValid = true;
    let wordArr = checkWord.toUpperCase().split("");
    let sidesOfChar = [],
      charpathindex = [];
    for (let i = 0; i < checkWord.length; i++) {
      let checkChar = wordArr[i];
      console.log(this.state.charset);
      let indexInBoard = this.state.charset.findIndex(item => {
        return item == checkChar;
      });
      console.log(indexInBoard);
      if (indexInBoard == -1) return false;
      else {
        if (i > 0) {
          let backindex = charpathindex.findIndex(function(c) {
            return c == indexInBoard;
          });
          let stepindex =
            sidesOfChar.length == 0
              ? 0
              : sidesOfChar.findIndex(function(c) {
                  return c == indexInBoard;
                });
          if (backindex != -1 || stepindex == -1) return false;
        }
        sidesOfChar = [];
        sidesOfChar.push(indexInBoard + 1);
        sidesOfChar.push(indexInBoard - 1);
        sidesOfChar.push(indexInBoard + 3);
        sidesOfChar.push(indexInBoard - 3);
        sidesOfChar.push(indexInBoard + 4);
        sidesOfChar.push(indexInBoard - 4);
        sidesOfChar.push(indexInBoard + 5);
        sidesOfChar.push(indexInBoard - 5);
        charpathindex.push(indexInBoard);
      }
    }
    return isValid;
  };
  handleSubmit = async () => {
    let newWord = this.state.wordtyped;
    let scoreBoard = this.state.scoreBoard;
    let duplicateIndex = scoreBoard.findIndex(item => item.word == newWord);
    try {
      if (
        this.state.gameStarting &&
        newWord.length >= 3 &&
        duplicateIndex == -1
      ) {
        let wordValidationResponse = await Axios.get(
          "https://googledictionaryapi.eu-gb.mybluemix.net/?define=" +
            newWord +
            "&lang=en"
        );
        if (wordValidationResponse.data.length > 0) {
          scoreBoard.push({ word: newWord, score: newWord.length });
          this.setState({ scoreBoard: scoreBoard });
          this.setState({ wordtyped: "", infoMessage: "Valid word submitted" });
          this.setTotalScore();
        }
      } else {
        this.setState({ wordtyped: "", infoMessage: "Cannot submit." });
        let infoMessage = "";
        infoMessage += !this.state.gameStarting ? "Start Game First" : "";
      }
    } catch (error) {
      this.setState({ wordtyped: "", infoMessage: "Invalid Word" });
    }
    this.textInput;
  };

  render() {
    return (
      <div className="container">
        <div className="d-flex">
          <div className="col-md-4">
            <div className="text-center">
              <h3>Play Boggle Game</h3>
              <Randomize doRandomize={this.handleRandomWord} />
              <PlayStop
                doPlayStop={this.handlePlayStop}
                isPlayOrStop={this.state.playstop}
              />
              <NewGame startNewGame={this.handelNewGame} />
            </div>
            <div className="p-2">
              <Cardboard generateTable={this.generateTable} />
            </div>
            <div>
              Counter: <span>{this.getTimeRemained()}</span>
            </div>
            <div>
              Word:{" "}
              <WordInput
                wordtyped={this.state.wordtyped}
                handleTypedWord={this.handleTypedWord}
                focus={this.state.focus}
              />
              <Submit handleSubmit={this.handleSubmit} />
            </div>
            <div>
              <span>{this.state.infoMessage}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <h3>Score Board</h3>
              <dd className="">{this.scoreBoradData()}</dd>
            </div>
            <div>
              Total Score: <strong>{this.state.totalScore}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Play;
