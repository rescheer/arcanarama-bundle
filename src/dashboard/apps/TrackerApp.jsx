/* eslint-disable react/prop-types */
import * as React from 'react';
import { useReplicant } from 'use-nodecg';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

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

export default function TrackerApp(props) {
  // eslint-disable-next-line no-unused-vars
  const [characters, updateCharacters] = useReplicant('characters');
  const { appSetter } = props;
  const { charSetter } = props;
  const { activeChar } = props;
  let character;

  function handleBackButtonClick() {
    window.localStorage.removeItem('storedChar');
    charSetter(undefined);
    appSetter('select');
  }

  if (characters) {
    characters.forEach((char, index) => {
      if (+activeChar === +char.ddbID) {
        character = characters[index];
      }
    });
    if (character === undefined) {
      handleBackButtonClick();
    }

    return (
      <ThemeProvider theme={baseTheme}>
        <Box>
          <Button
            sx={{ position: 'relative', left: 0, mb: 1 }}
            type="button"
            id="backButton"
            variant="contained"
            color="secondary"
            onClick={(event) => handleBackButtonClick(event)}
          >
            <Icon>arrow_back</Icon>
          </Button>
          <Box sx={{ color: 'text.primary' }}>
            <Typography align="center" variant="h4">
              {character.name}
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  return null;
}
