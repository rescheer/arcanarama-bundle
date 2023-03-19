/* eslint-disable react/prop-types */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { useReplicant } from 'use-nodecg';

// Ours
import TrackerApp from './apps/TrackerApp';
import CharacterSelectApp from './apps/CharacterSelectApp';
import AddCharacterApp from './apps/AddCharacterApp';

const charactersRep = window.nodecg.Replicant('characters');

function App() {
  // eslint-disable-next-line no-unused-vars
  const [characters, updateCharacters] = useReplicant('characters');
  const [activeApp, setActiveApp] = React.useState('select');
  const [activeChar, setActiveChar] = React.useState('');

  if (characters) {
    let component;

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
      <App />
    </React.StrictMode>
  );
});
