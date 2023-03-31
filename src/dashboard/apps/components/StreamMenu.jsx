/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function StreamMenu(props) {
  const { players, activePlayer, micEnabled, setMicEnabled } = props;
  const activeChannel = players[activePlayer].mixer.channel;

  const [errorString, setErrorString] = React.useState('');
  const [micEnabledWaiting, setMicEnabledWaiting] = React.useState(false);

  function getMicStateFromMixer() {
    window.nodecg.sendMessage(
      'mixer',
      {
        getChannelMute: {
          channel: activeChannel,
        },
      },
      (error, result) => {
        if (error) {
          setErrorString(`${error.message}. Try again`);
          return;
        }
        players[activePlayer].mixer.micEnabled = result;

        setMicEnabled(result);
      }
    );
  }

  function handleMicEnabledChange() {
    const newState = !micEnabled;
    const newStateAsNumber = !micEnabled ? 1 : 0;

    if (activeChannel && +activeChannel > 0 && +activeChannel <= 16) {
      setMicEnabledWaiting(true);
      setErrorString('');

      window.nodecg.sendMessage(
        'mixer',
        {
          setChannelMute: {
            channel: activeChannel,
            micState: newStateAsNumber,
          },
        },
        (error) => {
          if (error) {
            setMicEnabledWaiting(false);
            setErrorString(`${error.message}. Try again`);
            getMicStateFromMixer();
            return;
          }
          players[activePlayer].mixer.micEnabled = newState;

          setMicEnabledWaiting(false);
          setMicEnabled(newState);
        }
      );
    } else {
      setErrorString('Invalid channel');
    }
  }

  const micStatusText = micEnabled ? (
    <Typography>Active</Typography>
  ) : (
    <Typography color="red">MUTED</Typography>
  );

  const audioMenu = (
    <Box>
      <Typography variant="h5" textAlign="center">
        Audio
      </Typography>
      <Typography variant="subtitle2" textAlign="center" color="red">
        {errorString}
      </Typography>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ textAlign: 'left' }}>Mixer Channel</td>
            <td style={{ textAlign: 'right' }}>{`CH ${activeChannel}`}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>Mic Status</td>
            <td style={{ textAlign: 'right' }}>{micStatusText}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <Button
        variant="contained"
        color="error"
        disabled={micEnabledWaiting}
        sx={{ width: '35%', margin: 1 }}
        onClick={() => {
          handleMicEnabledChange();
        }}
      >
        {micEnabled ? 'Mute' : 'Unmute'}
      </Button>
    </Box>
  );

  return audioMenu;
}
