/* eslint-disable react/prop-types */
import * as React from 'react';
import ReactDOM from 'react-dom/client';

// Ours
import TrackerApp from './apps/TrackerApp';
import CharacterSelectApp from './apps/CharacterSelectApp';
import AddCharacterApp from './apps/AddCharacterApp';

const charactersRep = window.nodecg.Replicant('characters');

function App() {
  const [activeApp, setActiveApp] = React.useState('select');
  const [activeChar, setActiveChar] = React.useState('');
  const storedChar = window.localStorage.getItem('storedChar');

  if (storedChar && activeChar === '') {
    setActiveChar(storedChar);
    setActiveApp('tracker');
  }

  let component;
  switch (activeApp) {
    case 'select':
      component = (
        <CharacterSelectApp
          appSetter={setActiveApp}
          charSetter={setActiveChar}
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
        />
      );
      break;
  }
  return component;
}

window.NodeCG.waitForReplicants(charactersRep).then(() => {
  ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
