/* eslint-disable react/prop-types */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useReplicant } from 'use-nodecg';
import Icon from '@mui/material/Icon';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

// Ours
import TrackerApp from './apps/TrackerApp';
import CharacterSelectApp from './apps/CharacterSelectApp';
import AddCharacterApp from './apps/AddCharacterApp';

const charactersRep = window.nodecg.Replicant('characters');

const bottomNavTheme = createTheme({
  palette: {
    background: {
      paper: '#282828',
    },
    primary: {
      main: '#ffffff',
    },
    text: {
      secondary: '#00bebe',
    },
  },
});

function App() {
  // eslint-disable-next-line no-unused-vars
  const [characters, updateCharacters] = useReplicant('characters');
  const [activeApp, setActiveApp] = React.useState('select');
  const [activeChar, setActiveChar] = React.useState('');
  const [trackerPage, setTrackerPage] = React.useState(0);
  const [oldTrackerPage, setOldTrackerPage] = React.useState(0);

  if (characters) {
    let component;
    let bottomNavComponent;

    switch (activeApp) {
      case 'select':
        component = (
          <CharacterSelectApp
            appSetter={setActiveApp}
            charSetter={setActiveChar}
            characters={characters}
          />
        );
        break;
      case 'add':
        component = <AddCharacterApp appSetter={setActiveApp} />;
        break;
      default:
        component = (
          <TrackerApp
            appSetter={setActiveApp}
            activeChar={activeChar}
            charSetter={setActiveChar}
            characters={characters}
            trackerPage={trackerPage}
            oldTrackerPage={oldTrackerPage}
          />
        );

        bottomNavComponent = (
          <ThemeProvider theme={bottomNavTheme}>
            <BottomNavigation
              showLabels
              value={trackerPage}
              onChange={(event, newValue) => {
                setOldTrackerPage(trackerPage);
                setTrackerPage(newValue);
              }}
              sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
              }}
            >
              <BottomNavigationAction
                label="Hit Points"
                icon={<Icon>monitor_heart</Icon>}
                sx={{ px: 0, minWidth: 60 }}
              />
              <BottomNavigationAction
                label="More"
                icon={<Icon>flare</Icon>}
                sx={{ px: 0, minWidth: 60 }}
              />
              <BottomNavigationAction
                label="Settings"
                icon={<Icon>settings</Icon>}
                sx={{ px: 0, minWidth: 60 }}
              />
            </BottomNavigation>
          </ThemeProvider>
        );
        break;
    }
    return (
      <div>
        <div id="AppContainer">{component}</div>
        {bottomNavComponent}
      </div>
    );
  }
  return null;
}

window.NodeCG.waitForReplicants(charactersRep).then(() => {
  ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
