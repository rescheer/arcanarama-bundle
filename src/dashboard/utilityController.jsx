/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Ours
import UtilityApp from './molecules/UtilityApp';
import NCGStore, { replicateMany } from '../stores/NodecgStore';

const replicantNames = ['utilityItemList', 'currentUtilityItem'];

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      replicants: NCGStore.getReplicants(),
    };
  }

  componentDidMount() {
    // Subscribe to replicant changes
    replicateMany(...replicantNames);

    // We keep all our subscribed replicants in a single "replicants" object
    NCGStore.on('change', () => {
      this.setState({
        replicants: NCGStore.getReplicants(),
      });
    });
  }

  render() {
    const { replicants } = this.state;
    return (
      <React.StrictMode>
        <ThemeProvider theme={baseTheme}>
          <UtilityApp {...replicants} />
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}

const utilityItemList = window.NodeCG.Replicant(
  'utilityItemList',
  'arcanarama-bundle'
);
const currentUtilityItem = window.NodeCG.Replicant(
  'currentUtilityItem',
  'arcanarama-bundle'
);

window.NodeCG.waitForReplicants(utilityItemList, currentUtilityItem).then(
  () => {
    ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
  }
);
