/* eslint-disable react/prop-types */
import * as React from 'react';
import { useReplicant } from 'use-nodecg';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

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

const accordianTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.7)',
      secondary: 'rgba(0, 0, 0, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
});

/**
 * Returns an array with all player names found in the passed array
 * @param {Object[]} arr
 * @returns {Object[]} An Array containing player names
 */
function sortCharacters(arr) {
  const result = {};

  arr.forEach((element) => {
    const p = element.player;
    const resultKeys = Object.keys(result);
    if (!resultKeys.includes(p)) {
      result[p] = [];
    }
    result[p].push(element);
  });

  return result;
}

export default function CharacterSelectApp(props) {
  // eslint-disable-next-line no-unused-vars
  const [characters, updateCharacters] = useReplicant('characters');
  const { appSetter } = props;
  const { charSetter } = props;

  let sortedCharacters;

  if (characters) {
    sortedCharacters = sortCharacters(characters);
  }

  function handleCharacterClick(id) {
    window.localStorage.setItem('storedChar', id);
    charSetter(id);
    appSetter('tracker');
  }

  function handleAddButtonClick() {
    window.localStorage.removeItem('storedChar');
    charSetter(undefined);
    appSetter('add');
  }

  if (sortedCharacters) {
    const playerChildren = [];
    const players = Object.keys(sortedCharacters);

    players.forEach((player) => {
      const characterChildren = [];
      sortedCharacters[player].forEach((char, index) => {
        const hasDivider = index < sortedCharacters[player].length - 1;
        characterChildren.push(
          <ListItemButton
            key={char.name}
            alignItems="flex-start"
            divider={hasDivider}
            onClick={(event) =>
              handleCharacterClick(sortedCharacters[player][index].ddbID, event)
            }
          >
            <ListItemAvatar>
              <Avatar
                src="https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png"
                sx={{ height: 80, width: 80, mr: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={char.name}
              secondary="Race, Level Class / Level Class"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItemButton>
        );
      });

      const playerName =
        player.charAt(0).toUpperCase() + player.slice(1).toLowerCase();

      playerChildren.push(
        <ThemeProvider theme={accordianTheme} key={player}>
          <Accordion sx={{ bgcolor: '#525f78' }}>
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography variant="h5">{playerName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>{characterChildren}</List>
            </AccordionDetails>
          </Accordion>
        </ThemeProvider>
      );
    });

    return (
      <ThemeProvider theme={baseTheme}>
        <Box>
          <Box sx={{ textAlign: 'right' }}>
            <Button
              sx={{ mb: 2 }}
              type="button"
              id="addNewButton"
              variant="contained"
              color="secondary"
              onClick={(event) => handleAddButtonClick(event)}
            >
              <Icon>add</Icon>
            </Button>
          </Box>
          {playerChildren}
        </Box>
      </ThemeProvider>
    );
  }
}
