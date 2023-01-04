/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Ours
import VibeResultsApp from './apps/VibeResultsApp';
import NCGStore, { replicateMany } from '../stores/NodecgStore';

const propReplicants = ['vibesRep'];

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
      secondary: 'rgba(255, 255, 255, 0.5)',
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
          <VibeResultsApp {...replicants} />
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
