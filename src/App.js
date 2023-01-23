import React from 'react';

import { introPrint } from './staticContent/introPrint';
import Prefix from './components/Prefix';

import './App.css';


const darkModeStyles = {
  backgroundColor: 'rgb(37, 37, 37)',
  color: 'rgb(105, 207, 73)',
};
const lightModeStyles = {
  backgroundColor: 'rgb(255, 255, 255)',
  color: 'rgb(51, 187, 199)',
};

const getPrintOutput = (input) => {
  let print = '';
  let clickable = false;
  switch (print) {
    default:
      print = `zsh: command not found: ${input}`;
  }
  return { print, clickable };
};

const getCurrentTime = () => {
  const now = Date.now();
  const hours = new Date(now).getHours();
  const minutes = new Date(now).getMinutes();
  const seconds = new Date(now).getSeconds();

  return `${hours}:${minutes}:${seconds}`
};

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  // { cmd: str, time: str, print: str, clickable: bool, path: str }
  const [history, setHistory] = React.useState([]);
  const [currPath, setCurrPath] = React.useState('~');
  const [inputVal, setInputVal] = React.useState('');
  // x commands back
  const [arrowPointer, setArrowPointer] = React.useState(0);

  const onClear = () => {
    setHistory([introPrint])
  };

  const handleInputChange = (e) => {
    setInputVal(e.currentTarget.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'up') {
      const newArrowPointer = arrowPointer + 1 >= history.length - 1 ? history.length - 1 : arrowPointer + 1;
      setArrowPointer(newArrowPointer);
      setInputVal(history[history.length - 1 - arrowPointer]);
    } else if (e.key === 'down') {
      const newArrowPointer = arrowPointer - 1 <= 0 ? 0 : arrowPointer - 1;
      setArrowPointer(newArrowPointer);
      setInputVal(history[history.length - 1 - arrowPointer]);
    } else if (e.key === 'enter') {
      const { print, clickable } = getPrintOutput(inputVal);
      setHistory([
        ...history,
        { cmd: inputVal, time: getCurrentTime(), print, clickable, path: currPath }
      ]);
      setArrowPointer(0);
      setInputVal('');
    }
  };

  return (
    <div className="App" style={isDarkMode ? darkModeStyles : lightModeStyles}>
      {history.map(h => clickable ? (
        <>
          <Prefix path={h.path} time={h.time} />
          <a href={'#'}>{h.print}</a>
        </>
      ) : (
        <>
          <Prefix path={h.path} time={h.time} />
          <p>{h.print}</p>
        </>
      ))}
      <input value={inputVal} onChange={handleInputChange} onKeyDown={handleKeyDown} />
    </div>
  );
}

export default App;
