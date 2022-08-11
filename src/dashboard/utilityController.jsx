/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import VerticalTabs from './molecules/VerticalTabs';
import NCGStore, { replicateMany } from '../stores/NodecgStore';

const replicantNames = ['utilityItemList', 'currentUtilityItem'];

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
        <VerticalTabs {...replicants} />
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
