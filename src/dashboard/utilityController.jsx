/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VerticalTabs from './molecules/atoms/VerticalTabs';
import NCGStore, { replicateMany } from '../stores/NodecgStore';

const baseTheme = createTheme({});

const replicantNames = ['utilityItemList'];

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
          <VerticalTabs {...replicants} />
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
