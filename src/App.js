import React from 'react';

import { introPrint } from './staticContent/introPrint';
import Prefix from './components/Prefix';
import * as blogs from './staticContent/blogStartUpJournalThings';

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

const dirStructure = {
  '~': {
    links: [
      { text: 'linkedin', href: '' },
      { text: 'gitlab', href: '' },
      { text: 'github', href: '' },
    ],
    Downloads: ['resume'],
    Documents: {
      blog_start_up_journal_things: Object.values(blogs),
    },
  },
}

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  // { cmd: str, time: str, print: str, clickable: bool, path: str, isVisible: bool }
  const [history, setHistory] = React.useState([]);
  const [currPath, setCurrPath] = React.useState('~');
  const [inputVal, setInputVal] = React.useState('');
  const [currIntroPrint, setCurrIntroPrint] = React.useState('');
  // x commands back
  const [arrowPointer, setArrowPointer] = React.useState(0);
  const [displayTime, setDisplayTime] = React.useState(getCurrentTime());

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    function writeOutIntro() {
      setTimeout(() => {
        setCurrIntroPrint(introPrint.slice(0, currIntroPrint.length + 1));
      }, 20);
    }
    writeOutIntro();
  }, [currIntroPrint]);

  const handleInputChange = (e) => {
    setInputVal(e.currentTarget.value);
  };

  const handleKeyDown = (e) => {
    const arrowHistory = history.filter(h => h.cmd.length);
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newPointer = arrowPointer - 1;
      if (newPointer < 0) {
        setArrowPointer(0);
      } else {
        setArrowPointer(newPointer);
        setInputVal(arrowHistory[newPointer].cmd);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newPointer = arrowPointer + 1;
      if (newPointer > arrowHistory.length) {
        setInputVal('');
      } else {
        setArrowPointer(newPointer);
        setInputVal(arrowHistory[newPointer]?.cmd ?? '');
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
        case 'ls':
          let tempLoc = dirStructure;
          const dirs = currPath.split('/');
          dirs.forEach(dir => {
            tempLoc = tempLoc[dir];
          });
          print = typeof tempLoc === 'object' ? Object.keys(tempLoc) : tempLoc;
          if (dirs[dirs.length - 1] === 'links' || dirs[dirs.length - 1] === 'Downloads') {
            clickable = true;
          }
          break;
        case 'pwd':
          print = currPath
          break;
        case '':
          isVisible = true;
          break;
        default:
          print = `zsh: command not found: ${inputVal}`;
          break;
      }

      const time = getCurrentTime();
      newHistory = [
        ...newHistory,
        { cmd: inputVal, time, print, clickable, path: currPath, isVisible }
      ];
      setHistory(newHistory);
      const newArrowHistory = newHistory.filter(h => h.cmd.length);
      setArrowPointer((newArrowHistory.length || 1));
      setInputVal('');
      setDisplayTime(time);
    }
  };

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
              {Array.isArray(h.print) ? h.print.map(p => (
                <div style={{ paddingRight: '30px' }}>{p}</div>
              )) : (
                <p>{h.print}</p>
              )}
            </Row>
          ) : null}
        </React.Fragment>
      ))}
      <Row>
        <Prefix path={currPath} time={displayTime} />
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
