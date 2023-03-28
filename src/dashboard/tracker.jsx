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
import {
  NotificationTimed,
  NotificationPersist,
} from './apps/components/NotificationAction';

const charactersRep = window.nodecg.Replicant('characters');

function App() {
  // eslint-disable-next-line no-unused-vars
  const [characters, updateCharacters] = useReplicant('characters');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [activeApp, setActiveApp] = React.useState('select');
  const [activeCharId, setActiveCharId] = React.useState('');

  function handleNewNote(data) {
    const NOTE_DEFAULT_VARIANT = 'info';
    const noteVariant = data.variant || NOTE_DEFAULT_VARIANT;

    let noteAction;
    let noteDuration;
    if (data.duration !== null) {
      noteDuration = data.duration;
      noteAction = (
        <NotificationTimed
          text={data.text}
          duration={noteDuration}
          closeSnackbar={(e) => closeSnackbar(e)}
        />
      );
    } else {
      noteDuration = null;
      noteAction = (
        <NotificationPersist
          text={data.text}
          closeSnackbar={(e) => closeSnackbar(e)}
        />
      );
    }

    enqueueSnackbar(data.text, {
      key: data.text,
      action: noteAction,
      variant: noteVariant,
      autoHideDuration: noteDuration,
      disableWindowBlurListener: true,
      preventDuplicate: true,
      hideIconVariant: true,
      style: { minWidth: '200px', left: '0px' },
    });
  }

  React.useEffect(() => {
    window.nodecg.listenFor('notifier', handleNewNote);
    // Cleanup
    return () => {
      window.nodecg.unlisten('notifier', handleNewNote);
    };
  });

  if (characters) {
    let component;

    switch (activeApp) {
      case 'select':
        component = (
          <CharacterSelectApp
            appSetter={setActiveApp}
            charSetter={setActiveCharId}
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
          />
        );
        break;
    }
    return <div id="AppContainer">{component}</div>;
  }
  return null;
}

window.NodeCG.waitForReplicants(charactersRep).then(() => {
  ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
      <SnackbarProvider dense>
        <App />
      </SnackbarProvider>
    </React.StrictMode>
  );
});
