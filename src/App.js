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

const getCurrentTime = () => {
  const now = Date.now();
  const hours = new Date(now).getHours();
  const minutes = new Date(now).getMinutes();
  const seconds = new Date(now).getSeconds();

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
};

function Row({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {children}
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  // { cmd: str, time: str, print: str, clickable: bool, path: str, isVisible: bool }
  const [history, setHistory] = React.useState([]);
  const [currPath, setCurrPath] = React.useState('~');
  const [inputVal, setInputVal] = React.useState('');
  // x commands back
  const [arrowPointer, setArrowPointer] = React.useState(0);

  const inputRef = React.useRef(null);

  const handleInputChange = (e) => {
    setInputVal(e.currentTarget.value);
  };

  const handleKeyDown = (e) => {
    console.log('arrowPointer', arrowPointer)
    if (e.key === 'ArrowUp') {
      const newArrowPointer = arrowPointer + 1 >= history.length ? history.length : arrowPointer + 1;
      console.log('newArrowPointer', newArrowPointer)
      setArrowPointer(newArrowPointer);
      const newCmd = history[history.length - 1 - newArrowPointer].cmd;
      setInputVal(newCmd);
      inputRef.current.selectionEnd = newCmd.length;
      inputRef.current.selectionStart = newCmd.length;
    } else if (e.key === 'ArrowDown') {
      const newArrowPointer = arrowPointer - 1 <= 0 ? 0 : arrowPointer - 1;
      console.log('newArrowPointer', newArrowPointer)
      setArrowPointer(newArrowPointer);
      if (newArrowPointer > 0) {
        const newCmd = history[history.length - 1 - newArrowPointer].cmd;
        setInputVal(newCmd);
        inputRef.current.selectionEnd = newCmd.length;
        inputRef.current.selectionStart = newCmd.length;
      } else {
        setInputVal('');
      }
    } else if (e.key === 'Enter') {
      let print = '';
      let clickable = false;
      let newHistory = [...history];
      let isVisible = true;

      switch (inputVal) {
        case 'clear':
          newHistory = newHistory.map(h => ({ ...h, isVisible: false }));
          isVisible = false
          break;
        case 'dark':
          setIsDarkMode(true);
          break;
        case 'light':
          setIsDarkMode(false);
          break;
        default:
          print = `zsh: command not found: ${inputVal}`;
          break;
      }

      setHistory([
        ...newHistory,
        { cmd: inputVal, time: getCurrentTime(), print, clickable, path: currPath, isVisible }
      ]);
      setArrowPointer(0);
      setInputVal('');
    }
  };

  const visibleHistory = history.filter(h => h.isVisible);

  return (
    <div className="App" style={isDarkMode ? darkModeStyles : lightModeStyles}>
      <Row>
        <p>{introPrint}</p>
      </Row>
      {visibleHistory.map(h => h.clickable ? (
        <React.Fragment key={h.time}>
          <Row>
            <Prefix path={h.path} time={h.time} cmd={h.cmd} />
          </Row>
          <Row>
            <a href={'#'}>{h.print}</a>
          </Row>
        </React.Fragment>
      ) : (
        <React.Fragment key={h.time}>
          <Row>
            <Prefix path={h.path} time={h.time} cmd={h.cmd} />
          </Row>
          {h.print ? (
            <Row>
              <p>{h.print}</p>
            </Row>
          ) : null}
        </React.Fragment>
      ))}
      <Row>
        <Prefix path={currPath} />
        <input
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            ...(isDarkMode ? darkModeStyles : lightModeStyles),
            border: 'none',
          }}
          ref={inputRef}
        />
      </Row>
    </div>
  );
}

export default App;
