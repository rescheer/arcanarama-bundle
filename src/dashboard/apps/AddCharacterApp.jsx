/* eslint-disable react/prop-types */
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const baseTheme = createTheme({
  palette: {
    background: {
      paper: '#2f3a4f',
    },
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

export default function AddCharacterApp(props) {
  const { appSetter } = props;
  const playerItemArray = [];

  let submitDisabled = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitDisabled = true;
    const formData = new FormData(e.currentTarget);
    const player = formData.get('player');
    const ddbId = formData.get('ddbid');

    const responseNode = document.getElementById('response');

    const character = { player, ddbId };

    window.nodecg
      .sendMessage('character', { add: character })
      .then((result) => {
        responseNode.style.color = 'green';
        responseNode.innerHTML = result;
        submitDisabled = false;
      })
      .catch((error) => {
        responseNode.style.color = 'red';
        responseNode.innerHTML = error.message;
        submitDisabled = false;
      });
  };

  const playersRep = window.nodecg.Replicant('players');

  window.NodeCG.waitForReplicants(playersRep).then(() => {
    const players = Object.keys(playersRep.value);
    players.forEach((player) => {
      playerItemArray.push(
        <MenuItem key={player} value={player}>
          {player}
        </MenuItem>
      );
    });

    submitDisabled = false;
  });

  function handleBackButtonClick() {
    appSetter('select');
  }

  return (
    <ThemeProvider theme={baseTheme}>
      <Button
        sx={{
          position: 'absolute',
          left: -3,
          mt: 1,
          mb: 1,
          py: 2,
          zIndex: 90,
        }}
        type="button"
        id="backButton"
        variant="contained"
        color="primary"
        disabled={submitDisabled}
        onClick={(event) => handleBackButtonClick(event)}
      >
        <Icon>arrow_back</Icon>
      </Button>
      <Box sx={{ color: 'text.primary' }}>
        <Typography
          align="center"
          variant="h5"
          sx={{ position: 'relative', top: 10 }}
        >
          Import a Character
        </Typography>
        <Typography
          align="center"
          variant="subtitle2"
          sx={{ position: 'relative', top: 10 }}
        >
          from D&DBeyond
        </Typography>
      </Box>
      <Box align="center">
        <form onSubmit={handleSubmit}>
          <TextField
            id="ddbid"
            name="ddbid"
            label="D&D Beyond ID"
            required
            helperText="Character must be set to Public"
            inputProps={{ inputMode: 'text', pattern: '^[0-9]+$' }}
            InputLabelProps={{ shrink: true }}
            color="secondary"
            variant="filled"
            sx={{ mt: 5, mb: 3, width: 1, maxWidth: 500 }}
          />
          <br />
          <TextField
            select
            id="player"
            name="player"
            label="Player"
            defaultValue=""
            required
            color="secondary"
            variant="filled"
            sx={{ mb: 1, width: 0.8, maxWidth: 350 }}
          >
            {playerItemArray}
            <MenuItem key="Guest" value="Guest">
              Guest
            </MenuItem>
          </TextField>
          <br />
          <br />
          <Button
            sx={{ width: 0.75, minWidth: 150 }}
            type="submit"
            id="submitButton"
            variant="contained"
            color="secondary"
            disabled={submitDisabled}
          >
            Add Character
          </Button>
        </form>
        <p id="response" />
      </Box>
    </ThemeProvider>
  );
}
