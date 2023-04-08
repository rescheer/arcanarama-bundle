/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useReplicant } from 'use-nodecg';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Ours
import TrackerApp from './apps/TrackerApp';
import CharacterSelectApp from './apps/CharacterSelectApp';
import AddCharacterApp from './apps/AddCharacterApp';
import DmApp from './apps/DmApp';
import NotificationTimed from './apps/components/NotificationAction';

// Replicants
const charactersRep = window.nodecg.Replicant('characters');
const playersRep = window.nodecg.Replicant('players');
const notificationsRep = window.nodecg.Replicant('notifications');
const messengerRep = window.nodecg.Replicant('messenger');

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    success: {
      main: '#40bf40',
    },
    info: {
      main: '#0244f1',
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(0, 0, 0, 1)',
    },
    background: {
      paper: '#009797',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
});

function App() {
  // States
  const [characters] = useReplicant('characters');
  const [players] = useReplicant('players');
  const [notifications] = useReplicant('notifications');
  const [messages] = useReplicant('messenger');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [activeApp, setActiveApp] = React.useState('select');
  const [activeCharId, setActiveCharId] = React.useState(0);
  const [activePlayer, setActivePlayer] = React.useState('');

  // Effects
  React.useEffect(() => {
    function enqueueNewNote(note) {
      const { text, variant, duration } = note;

      const noteAction = (
        <NotificationTimed
          text={text}
          duration={duration}
          closeSnackbar={(e) => closeSnackbar(e)}
        />
      );

      enqueueSnackbar(text, {
        key: text,
        action: noteAction,
        variant,
        autoHideDuration: duration,
        preventDuplicate: true,
        hideIconVariant: true,
      });
    }

    function checkValues(newValue, oldValue) {
      if (oldValue) {
        const playerNotesArray = newValue[activePlayer];
        if (playerNotesArray.length > oldValue[activePlayer].length) {
          const newNoteQuantity =
            playerNotesArray.length - oldValue[activePlayer].length;
          const newNotesArray = playerNotesArray.slice(-1 * newNoteQuantity);

          newNotesArray.forEach((note) => enqueueNewNote(note));
        }
      }
    }

    notificationsRep.on('change', checkValues);
    // Cleanup
    return () => {
      notificationsRep.removeListener('change', checkValues);
    };
  }, [notifications, enqueueSnackbar, closeSnackbar, activePlayer]);

  React.useEffect(() => {
    function handleCharActivation(charId) {
      if (charId) {
        const playerName = characters[charId].player;
        players[playerName].activeCharacter = charId;
      }
    }
    handleCharActivation(activeCharId);
  }, [activeCharId, characters, players]);

  if (characters && players) {
    let id = '';
    let component;

    switch (activeApp) {
      case 'select':
        id = 'AppContainer';
        component = (
          <CharacterSelectApp
            appSetter={setActiveApp}
            charSetter={setActiveCharId}
            playerSetter={setActivePlayer}
            characters={characters}
          />
        );
        break;
      case 'add':
        id = 'AppContainer';
        component = <AddCharacterApp appSetter={setActiveApp} />;
        break;
      case 'dm':
        id = '';
        component = (
          <DmApp
            appSetter={setActiveApp}
            characters={characters}
            players={players}
            notifications={notifications}
            messages={messages}
          />
        );
        break;
      default:
        id = 'AppContainer';
        component = (
          <TrackerApp
            appSetter={setActiveApp}
            activeCharId={activeCharId}
            charSetter={setActiveCharId}
            characters={characters}
            players={players}
            activePlayer={activePlayer}
            notifications={notifications}
            messages={messages}
          />
        );
        break;
    }
    return <div id={id}>{component}</div>;
  }
  return null;
}

window.NodeCG.waitForReplicants(
  charactersRep,
  playersRep,
  notificationsRep,
  messengerRep
).then(() => {
  ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
      <SnackbarProvider dense>
        <ThemeProvider theme={baseTheme}>
          <App />
        </ThemeProvider>
      </SnackbarProvider>
    </React.StrictMode>
  );
});
