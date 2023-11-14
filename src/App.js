import { useState } from 'react';

/* Create a custom React Component called 'Square' to pass into our Board component.
 * I didn't realize you could have multiple components defined in the same file!
 */
function Square() {
  const [value, setValue] = useState(null);
  
  function handleClick() {
    setValue('X');
  }

  return <button className="square" onClick={handleClick}>{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
