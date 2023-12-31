import { useState } from 'react';

/* Create a custom React Component called 'Square' to be rendered by our Board component.
 * I didn't realize you could have multiple components defined in the same file!
 * We will have 9 instances of 'Square' and each Square receives a value prop ('X', 'O', null)
 */
function Square({ value, onSquareClick, isWinner }) {
  const classNames = isWinner ? "square winner" : "square";
  return <button className={classNames} onClick={onSquareClick}>{value}</button>;
  
  //Removing the Square's stateful tracking of value and the onclick.  It is better tracked by our Board component (parent)
  //const [value, setValue] = useState(null);  
  // function handleClick() {
  //   setValue('X');
  // }
}

/* This component tracks the Board layout.  It used to be our top-level component.
 *   - However, we have a new requirement for tracking "history" and all prior board states.
 *   - By creating a new "Game" component (below), it now becomes our top-level component.
 *   - For that reason, we have removed the "export default" keywords that were before the 'function Board()' declaration.
 *   - This tells the index.js file to use the "Game" component as the top-level component instead of the  Board component. 
 *   - It will now be fully controlled by the "Game" component (parent) based on the props it receives from the parent.
 */
function Board({ xIsNext, squares, onPlay }) {
  /* Update the squares array to represent and track the Square component that has been clicked:
   *   - this function creates a "copy" of the squares array (nextSquares) with the JS slice() function.
   *   - Update the nextSquares array accordingly, based on use click.
   */
  function handleClick(i) { //It is only now that we actuall CALL the function with the paren's
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "♥" : "☼";
    onPlay(nextSquares);
  }

  //Display information to the player when the game is over:
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "♥" : "☼");
  }
  
  // Our Board component tracks game state, and passes the value prop down to each Square that it renders:
  // We are using the arrow function syntax in our Square component, which waits until the user clicks a square before executing.
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinner={winner && winner === squares[0]} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinner={winner && winner === squares[1]} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinner={winner && winner === squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinner={winner && winner === squares[3]} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinner={winner && winner === squares[4]} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinner={winner && winner === squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinner={winner && winner === squares[6]} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinner={winner && winner === squares[7]} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinner={winner && winner === squares[8]} />
      </div>
    </>
  );
}

/* This 'Game' component is now our top-level component so that we can display a list of past moves.
 *   - in an earlier version, 'Board' was our top-level React component.  That worked fine for the basic Tic-Tac-Toe game.
 *   - Now, we are placing the history state into this new Game component, which lets us remove the "squares" state from the Board component (now a child).
 *   - Just like we “lifted state up” from the Square component into the Board component, we are now lifting state up from the Board into the top-level Game component.
 *   - This gives this new "Game" component full control over the Board’s data and allows it to instruct the Board to render previous turns from the history.
 */
export default function Game() {

  /* Create an array with nine elements (representing our gameboard) and set each of them to null using fill function.
   *   - Also note the 'useState(...)' call surrounding the Array initialization. 
   *   - The useState() hook tracks state.  We use it to declare a 'squares' state variable (set to null)
   *   - Each call of this function adds it to our History as well, from which we can "go back" to any game state
   */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  
  //Capture current board state and track player status:
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  /* Called (by the Board component) to update the game layout: 
   *   - Now adding as a history entry; enumerate all items in hitory.
   *   - Used to let React know the component state has changed; triggered a re-render. 
   */
  function handlePlay(nextSquares) {    
    // If we go "back in time," only keep history to that point, then set current move to point at latest history entry:
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);  
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Jump back to move : ' + move;
    } else {
      description = 'Rewind to Start of Game';
    }
    return (
      <li key = {move}>
        <button onClick = {() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}