import React from 'react';

import { introPrint } from './staticContent/introPrint';
import Prefix from './components/Prefix';
import * as blogs from './staticContent/blogStartUpJournalThings';

import './App.css';


const darkModeStylez = {
  backgroundColor: 'rgb(37, 37, 37)',
  color: 'rgb(105, 207, 73)',
};
const lightModeStylez = {
  backgroundColor: 'rgb(255, 255, 255)',
  color: 'rgb(51, 187, 199)',
};
const textPrintStylez = { whiteSpace: 'pre-line' };

const getCurrentTime = () => {
  const now = Date.now();
  const hours = new Date(now).getHours();
  const minutes = new Date(now).getMinutes();
  const seconds = new Date(now).getSeconds();

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
};

function Row({ children, styles }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', ...styles }}>
      {children}
    </div>
  );
}

const resumeTitle = 'James_Rogers_Resume.pdf';
const dirStructure = {
  '~': {
    links: [
      { title: 'linkedin', href: 'https://www.linkedin.com/in/jd2rogers2/' },
      { title: 'github', href: 'https://github.com/jd2rogers2' },
      { title: 'gitlab', href: 'https://gitlab.com/jd2rogers2' },
    ],
    Downloads: [{ title: resumeTitle }],
    Documents: {
      blog_start_up_journal_things: Object.values(blogs),
    },
  },
}

const getCurrPathInfo = (currPath) => {
  let tempLoc = dirStructure;
  const dirs = currPath.split('/');
  dirs.forEach(dir => {
    tempLoc = tempLoc[dir];
  });
  return [tempLoc, dirs];
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
  const [matches, setMatches] = React.useState([]);
  const [resumeLink, setResumeLink] = React.useState(null);

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    function writeOutIntro() {
      setTimeout(() => {
        setCurrIntroPrint(introPrint.slice(0, currIntroPrint.length + 1));
      }, 20);
    }
    writeOutIntro();
  }, [currIntroPrint]);

  React.useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  // prefetch resume
  React.useEffect(() => {
    fetch('James_Rogers_Resume.pdf').then(response => {
      response.blob().then(blob => {
        const fileURL = window.URL.createObjectURL(blob);
        setResumeLink(fileURL);
      })
  })
  }, []);

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
    } else if (e.key === 'Tab') {
      e.preventDefault();

      if (!(inputVal.startsWith('cd') || inputVal.startsWith('cat'))) {
        return;
      }

      let cmdArg = '';
      if (inputVal.includes(' ')) {
        cmdArg = inputVal.slice(inputVal.indexOf(' ') + 1);
      }

      const cmd = inputVal.startsWith('cd') ? 'cd' : 'cat';
      const [currLoc] = getCurrPathInfo(currPath);
      const children = Array.isArray(currLoc) ? currLoc : Object.keys(currLoc);
      const newMatches = children.filter(c => (
        (c.title || c).startsWith(cmdArg)
        && (!(c.title || c).includes('.') || cmd === 'cat')
      )).map(c => c?.title || c);
      if (newMatches.length > 1) {
        setMatches(newMatches);
      } else if (newMatches.length === 1) {
        setInputVal(`${cmd} ${newMatches[0]?.title || newMatches[0]}`);
        setMatches([]);
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      const time = getCurrentTime();
      const newHistory = [
        ...history,
        { cmd: inputVal, time, print: '', clickable: false, path: currPath, isVisible: true }
      ];
      setHistory(newHistory);
      setInputVal('');
      setDisplayTime(time);
    } else if (e.key === 'Enter') {
      let print = '';
      let clickable = false;
      let newHistory = [...history];
      let isVisible = true;
      let isBlog = false;

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
          const [currLoc, dirs] = getCurrPathInfo(currPath);
          print = Array.isArray(currLoc) ? currLoc : Object.keys(currLoc);
          if (dirs[dirs.length - 1] === 'links' || dirs[dirs.length - 1] === 'Downloads') {
            clickable = true;
          }
          break;
        case 'pwd':
          print = currPath;
          break;
        case 'welcome':
          print = introPrint;
          break;
        case 'help':
          print = introPrint;
          break;
        case '':
          break;
        default:
          if (inputVal.startsWith('cat ')) {
            const catFile = inputVal.slice(4);
            if (!catFile.includes('.')) {
              print = `cat: ${catFile}: Is a directory`;
            } else {
              isBlog = true;
              print = Object.values(blogs).find(b => b.title === catFile);
            }
            break;
          } else if (inputVal.startsWith('cd ')) {
            const [currLoc] = getCurrPathInfo(currPath);
            const children = Array.isArray(currLoc) ? currLoc : Object.keys(currLoc);
            const nextLoc = inputVal.slice(3);
            if (nextLoc === '..') {
              setCurrPath(currPath.slice(0, currPath.lastIndexOf('/')));
            } else if (nextLoc.includes('.')) {
              print = `cd: not a directory: ${nextLoc}`;
            } else if (children.includes(nextLoc)) {
              setCurrPath(`${currPath}/${nextLoc}`);
            } else if (nextLoc === '~') {
              setCurrPath(nextLoc);
            } else {
              print = `cd: no such file or directory: ${nextLoc}`;
            }
            break;
          } else if (inputVal.startsWith('echo ')) {
            print = inputVal.slice(5);
            break;
          }
          print = `zsh: command not found: ${inputVal}`;
          break;
      }

      const time = getCurrentTime();
      newHistory = [
        ...newHistory,
        { cmd: inputVal, time, print, clickable, path: currPath, isVisible, isBlog }
      ];
      setHistory(newHistory);
      const newArrowHistory = newHistory.filter(h => h.cmd.length);
      setArrowPointer((newArrowHistory.length || 1));
      setInputVal('');
      setDisplayTime(time);
      setMatches([]);
    }
  };

  const handleClickAnywhere = () => {
    inputRef.current.focus();
  }

  const visibleHistory = history.filter(h => h.isVisible);

  return (
    <div className="App" style={isDarkMode ? darkModeStylez : lightModeStylez} onClick={handleClickAnywhere}>
      <Row styles={textPrintStylez}>
        {currIntroPrint}
      </Row>
      {visibleHistory.map(h => h.clickable ? (
        <React.Fragment key={h.time}>
          <Row>
            <Prefix path={h.path} time={h.time} cmd={h.cmd} />
          </Row>
          <Row>
            {Array.isArray(h.print) ? h.print.map(p => (
              <a
                key={p.title}
                href={p.title === resumeTitle ? resumeLink : p.href}
                target="_blank"
                rel="noreferrer"
                style={{ paddingRight: '30px' }}
                download={p.title === resumeTitle ? resumeTitle : false}
              >{p.title}</a>
            )) : (
              <a href={h.href} target="_blank" rel="noreferrer">{h.print}</a>
            )}
          </Row>
        </React.Fragment>
      ) : (
        <React.Fragment key={h.time}>
          <Row>
            <Prefix path={h.path} time={h.time} cmd={h.cmd} />
          </Row>
          {h.print ? (
            <Row style={h.cmd === 'welcome' ? textPrintStylez : {}}>
              {Array.isArray(h.print) ? (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    { console.log(h.print) }
                    {h.print.slice(0, Math.floor(h.print.length / 2 + 1)).map(p => (
                      <div key={p.title} style={{ paddingRight: '100px' }}>{p?.title ?? p}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {h.print.slice(Math.floor(h.print.length / 2 + 1)).map(p => (
                      <div key={p.title} style={{ paddingRight: '100px' }}>{p?.title ?? p}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {h.isBlog ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'center',
                        padding: '30px 0',
                      }}
                    >
                      <Row>{h.print.title}</Row>
                      <Row>{h.print.date}</Row>
                      <Row styles={textPrintStylez}>{h.print.content}</Row>
                    </div>
                  ) : (
                    <p>{h.print}</p>
                  )}
                </>
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
            ...(isDarkMode ? darkModeStylez : lightModeStylez),
            border: 'none',
          }}
          ref={inputRef}
          size={inputVal.length || 1}
          autoFocus
        />
      </Row>
      {matches.length ? (
        <Row>
          {matches.map(m => (
            <div key={m} style={{ paddingRight: '50px' }}>{m}</div>
          ))}
        </Row>
      ) : null}
    </div>
  );
}

export default App;
