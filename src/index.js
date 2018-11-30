import React from "react";

import ReactDOM from "react-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import "./index.css";

function Square(props) {
  let classNames = "square " + props.winner;
  return (
    <Button variant="contained" color="default" className={classNames} onClick={props.onClick}>
      {props.value}
    </Button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winner;

    if (this.props.winnerLines && this.props.winnerLines.includes(i)) {
      winner = "is--winner";
    }

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={winner}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      winnerLines: "",
      restart: false,
      xIsNext: true
    };
  }

  startNewGame() {
    this.setState({
        history: [
            {
                squares: Array(9).fill(null)
            }
        ],
        stepNumber: 0,
        winnerLines: "",
        restart: false,
        xIsNext: true
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i] || this.state.restart) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    if((this.state.stepNumber+1) === 9) {
      this.setState((prevState, props) => {
          return {
              stepNumber: 9,
              restart: true
          }
      });
    }

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  setWinnerLines(winner) {
    return winner.toString();
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let winnerLines;
    let draw;
    let moves;

    if (this.state.restart) draw = "Draw! Start new Game!";

    if (winner) {
      winnerLines = this.setWinnerLines(winner.lines);
    }

    if(draw) {
          moves = <Button variant="contained" color="secondary" onClick={() => this.startNewGame()}>Start New Game</Button>
    }else {
      moves = history.map((step, move) => {
          const desc = move ? "Go to move #" + move : "Go to game start";
          return (
              <li className="button-moves" key={move}>
                  <Button variant="contained" color="primary" onClick={() => this.jumpTo(move)}>{desc}</Button>
              </li>
          );
      });
    }

    let status;
    if (winner) {
      status = "Winner: " + winner.player;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
          <Typography component="h1" variant="h1" gutterBottom={true}>
            Tic-Tac-To Game with react
          </Typography>
          <div className="game">
              <div className="game-board">
                  <Board
                      squares={current.squares}
                      onClick={i => this.handleClick(i)}
                      winnerLines={winnerLines}
                  />
              </div>
              <div className="game-info">
                  {draw ? (
                      <div>{draw}</div>
                  ) : (
                      <div>{status}</div>
                  )}

                  <ol>{moves}</ol>
              </div>
          </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        lines: lines[i]
      };
    }
  }
  return null;
}
