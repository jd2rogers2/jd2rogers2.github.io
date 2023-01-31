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

function Row({ children, styles }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', ...styles }}>
      {children}
    </div>
  );
}

// function Cursor() {
//   const [isBlinked, setIsBlinked] = React.useState(true);

//   React.useEffect(() => {
//     setTimeout(() => {
//       setIsBlinked(!isBlinked);
//     }, 500);
//   }, [isBlinked]);

//   return (
//     <div style={{ height: '20px', width: '12px', backgroundColor: isBlinked ? 'white' : 'black' }} />
//   );
// }

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  // { cmd: str, time: str, print: str, clickable: bool, path: str, isVisible: bool }
  const [history, setHistory] = React.useState([]);
  const [currPath, setCurrPath] = React.useState('~');
  const [inputVal, setInputVal] = React.useState('');
  const [currIntroPrint, setCurrIntroPrint] = React.useState('');
  // x commands back
  const [arrowPointer, setArrowPointer] = React.useState(0);

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    function writeOutIntro() {
      return;
      // setTimeout(() => {
      //   setCurrIntroPrint(introPrint.slice(0, currIntroPrint.length + 1));
      // }, 20);
    }
    writeOutIntro();
  }, [currIntroPrint]);

  const handleInputChange = (e) => {
    setInputVal(e.currentTarget.value);
  };

  const arrowHistory = history.filter(h => h.cmd.length);

  const handleKeyDown = (e) => {
    console.log('arrowPointer', arrowPointer)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newPointer = arrowPointer - 1;
      if (newPointer < 0) {
        setArrowPointer(0);
      } else {
        setArrowPointer(newPointer);
      }
      setInputVal(arrowHistory[newPointer].cmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newPointer = arrowPointer + 1;
      if (newPointer > arrowHistory.length - 1) {
        setInputVal('');
      } else {
        setArrowPointer(newPointer);
        setInputVal(arrowHistory[newPointer].cmd);
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
        case '':
          isVisible = true;
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
      console.log('arrowHistory', arrowHistory);
      setArrowPointer((arrowHistory.length || 1) - 1);
      setInputVal('');
    }
  };

  console.log('arrowPointer', arrowPointer);

  const handleClickAnywhere = () => {
    inputRef.current.focus();
  }

  const visibleHistory = history.filter(h => h.isVisible);

  return (
    <div className="App" style={isDarkMode ? darkModeStyles : lightModeStyles} onClick={handleClickAnywhere}>
      <Row styles={{ whiteSpace: 'pre-line' }}>
        {currIntroPrint}
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
          size={inputVal.length || 1}
          autoFocus
        />
      </Row>
    </div>
  );
}

export default App;
