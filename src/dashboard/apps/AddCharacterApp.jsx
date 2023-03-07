/* eslint-disable react/prop-types */
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

export default function AddCharacterApp(props) {
  const { appSetter } = props;

  const [submitDisabled, setSubmitDisabled] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitDisabled(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const player = formData.get('player').toUpperCase();
    const ddbID = formData.get('ddbid');

    const responseNode = document.getElementById('response');

    const character = { name, player, ddbID };

    document.getElementById('submitButton').setAttribute('disabled', true);

    window.nodecg
      .sendMessage('character', { add: character })
      .then((result) => {
        responseNode.style.color = 'green';
        responseNode.innerHTML = result;
        setSubmitDisabled(false);
      })
      .catch((error) => {
        responseNode.style.color = 'red';
        responseNode.innerHTML = error.message;
        setSubmitDisabled(false);
      });

    return false;
  };

  function handleBackButtonClick() {
    appSetter('select');
  }

  return (
    <ThemeProvider theme={baseTheme}>
      <Box component="form" onSubmit={handleSubmit} align="center">
        <Button
          sx={{ position: 'absolute', left: 0, mb: 4 }}
          type="button"
          id="backButton"
          variant="contained"
          color="secondary"
          onClick={(event) => handleBackButtonClick(event)}
        >
          <Icon>arrow_back</Icon>
        </Button>
        <TextField
          id="name"
          name="name"
          label="Character Name"
          required
          helperText="Letters and numbers only"
          inputProps={{ inputMode: 'text', pattern: '^[a-zA-Z0-9]+$' }}
          color="secondary"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 6, mb: 1, width: 1, maxWidth: 500 }}
        />
        <br />
        <TextField
          id="player"
          name="player"
          label="Player Name"
          required
          helperText="Letters and numbers only"
          inputProps={{ inputMode: 'text', pattern: '^[a-zA-Z0-9]+$' }}
          InputLabelProps={{ shrink: true }}
          color="secondary"
          variant="filled"
          sx={{ mb: 1, width: 1, maxWidth: 500 }}
        />
        <br />
        <TextField
          id="ddbid"
          name="ddbid"
          label="D&DBeyond ID"
          required
          inputProps={{ inputMode: 'text', pattern: '^[0-9]+$' }}
          InputLabelProps={{ shrink: true }}
          color="secondary"
          variant="filled"
          sx={{ mb: 1, width: 1, maxWidth: 500 }}
        />
        <br />
        <br />
        <Button
          sx={{ width: 0.5, maxWidth: 300 }}
          type="submit"
          id="submitButton"
          variant="contained"
          color="secondary"
          disabled={submitDisabled}
        >
          Add Character
        </Button>
        <p id="response" />
      </Box>
    </ThemeProvider>
  );
}
