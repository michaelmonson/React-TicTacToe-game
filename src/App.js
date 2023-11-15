import { useState } from 'react';

/* Create a custom React Component called 'Square' to be rendered by our Board component.
 * I didn't realize you could have multiple components defined in the same file!
 * We will have 9 instances of 'Square' and each Square receives a value prop ('X', 'O', null)
 */
function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
  
  //Removing the Square's stateful tracking of value and the onclick.  It is better tracked by our Board component (parent)
  //const [value, setValue] = useState(null);  
  // function handleClick() {
  //   setValue('X');
  // }
}

export default function Board() {
  /* 
   * Create an array with nine elements (representing our gameboard) and set each of them to null using fill.
   *   - Also note the 'useState(...)' call surrounding the Array initialization. 
   *   - The useState() hook tracks state.  We use it to declare a 'squares' state variable (set to null)
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  /* Update the squares array to represent and track the Square component that has been clicked:
   *   - this function creates a "copy" of the squares array (nextSquares) with the JS slice() function.
   *   - Update the nextSquares array accordingly, based on use click.
   */
  function handleClick(i) { //It is only now that we actuall CALL the function with the paren's
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);  //lets React know the component state has changed; triggers a re-render.
    setXIsNext( !xIsNext );
  }
  
  // Our Board component tracks game state, and passes the value prop down to each Square that it renders:
  // We are using the arrow function syntax in our Square component, which waits until the user clicks a square before executing.
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
