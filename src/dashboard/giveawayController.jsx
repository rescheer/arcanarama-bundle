/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Ours
import GiveawayApp from './molecules/GiveawayApp';
import NCGStore, { replicateMany } from '../stores/NodecgStore';

const propReplicants = ['statusRep', 'giveawayRep'];

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.7)',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
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
    replicateMany(...propReplicants);

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
          <GiveawayApp {...replicants} />
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
