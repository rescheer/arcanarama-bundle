/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { useReplicant } from 'use-nodecg';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Ours
import TrackerApp from './apps/TrackerApp';
import CharacterSelectApp from './apps/CharacterSelectApp';
import AddCharacterApp from './apps/AddCharacterApp';
import NotificationTimed from './apps/components/NotificationAction';

// Replicants
const charactersRep = window.nodecg.Replicant('characters');
const playersRep = window.nodecg.Replicant('players');
const notificationsRep = window.nodecg.Replicant('notifications');

function App() {
  const [characters] = useReplicant('characters');
  const [players] = useReplicant('players');
  const [notifications] = useReplicant('notifications');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [activeApp, setActiveApp] = React.useState('select');
  const [activeCharId, setActiveCharId] = React.useState('');
  const [activePlayer, setActivePlayer] = React.useState('');

  React.useEffect(() => {
    function enqueueNewNote(note) {
      const { text, variant, duration } = note;

      const noteVariant = variant || 'default';
      const noteDuration = duration || 10 * 1000;
      const noteAction = (
        <NotificationTimed
          text={text}
          duration={noteDuration}
          closeSnackbar={(e) => closeSnackbar(e)}
        />
      );

      enqueueSnackbar(text, {
        key: text,
        action: noteAction,
        variant: noteVariant,
        autoHideDuration: noteDuration,
        disableWindowBlurListener: true,
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

  if (characters && players) {
    let component;

    switch (activeApp) {
      case 'select':
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
        component = <AddCharacterApp appSetter={setActiveApp} />;
        break;
      default:
        component = (
          <TrackerApp
            appSetter={setActiveApp}
            activeCharId={activeCharId}
            charSetter={setActiveCharId}
            characters={characters}
            players={players}
            activePlayer={activePlayer}
            notifications={notifications}
          />
        );
        break;
    }
    return <div id="AppContainer">{component}</div>;
  }
  return null;
}

window.NodeCG.waitForReplicants(
  charactersRep,
  playersRep,
  notificationsRep
).then(() => {
  ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
      <SnackbarProvider dense>
        <App />
      </SnackbarProvider>
    </React.StrictMode>
  );
});
