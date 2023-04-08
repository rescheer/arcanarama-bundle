/* eslint-disable react/prop-types */
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Fab from '@mui/material/Fab';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// Ours
import getRelativeTimeString from '../utils/Common';

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
      primary: 'rgba(0, 0, 0, 0.9)',
      secondary: 'rgba(0, 0, 0, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
});

/**
 * Returns an object of characters sorted by player
 * @param {Object} replicant - A replicant containing one or more characters
 * @param {bool} showHidden - (default: false) If true, shows hidden characters
 * @returns {Object} An Object with Player keys and character values
 */
function groupCharactersByPlayer(replicant, showHidden = false) {
  const result = {};
  const data = replicant;

  if (data) {
    const ddbIdArray = Object.keys(data);
    if (ddbIdArray.length > 0) {
      ddbIdArray.forEach((ddbId) => {
        const p = data[ddbId].player;
        if (!data[ddbId].hidden || showHidden) {
          if (!Object.keys(result).includes(p)) {
            result[p] = [];
          }

          result[p].push(data[ddbId]);
        }
      });
    }
  }

  return result;
}

export default function CharacterSelectApp(props) {
  const { characters, appSetter, charSetter, playerSetter } = props;

  const [expanded, setExpanded] = React.useState('');
  const [showHidden, setShowHidden] = React.useState(false);

  let sortedCharacters;

  if (characters) {
    sortedCharacters = groupCharactersByPlayer(characters, showHidden);
  }

  const handleAccordionOpen = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function handleDmViewClick() {
    appSetter('dm');
  }

  function handleCharacterClick(id) {
    window.localStorage.setItem('storedChar', id);
    playerSetter(characters[id].player);
    charSetter(id);
    appSetter('tracker');
  }

  function handleAddButtonClick() {
    window.localStorage.removeItem('storedChar');
    playerSetter(undefined);
    charSetter(undefined);
    appSetter('add');
  }

  function handleShowHiddenSwitchClick() {
    setShowHidden(!showHidden);
  }

  if (sortedCharacters) {
    const playerChildren = [];
    const players = Object.keys(sortedCharacters);

    players.forEach((player) => {
      const characterChildren = [];
      sortedCharacters[player].forEach((char, index) => {
        if (char?.data?.fullName) {
          const hasDivider = index < sortedCharacters[player].length - 1;

          const { fullName, description } = char.data;
          const { timestamp } = char;
          const timeString = getRelativeTimeString(timestamp);

          // Get avatar
          let { avatarUrl } = char.data;
          const defaultAvatarUrl =
            'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png';
          if (avatarUrl === '') {
            avatarUrl = defaultAvatarUrl;
          }

          const primaryInfo = (
            <>
              {char.hidden ? <Icon>visibility_off</Icon> : ''}
              {fullName}
            </>
          );

          characterChildren.push(
            <ListItemButton
              key={char.ddbId}
              alignItems="flex-start"
              divider={hasDivider}
              sx={{ py: 0 }}
              onClick={(event) =>
                handleCharacterClick(
                  sortedCharacters[player][index].ddbId,
                  event
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={avatarUrl} sx={{ height: 80, width: 80, mr: 2 }} />
              </ListItemAvatar>
              <ListItemText
                primary={primaryInfo}
                primaryTypographyProps={{ variant: 'h5' }}
                secondary={
                  <>
                    {description.classes.simple.toString().replace(/,/g, ' / ')}
                    <br />
                    Imported {timeString}
                  </>
                }
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          );
        }
      });

      const playerName =
        player.charAt(0).toUpperCase() + player.slice(1).toLowerCase();

      playerChildren.push(
        <ThemeProvider theme={accordianTheme} key={player}>
          <Accordion
            sx={{ bgcolor: '#525f78' }}
            expanded={expanded === player}
            onChange={handleAccordionOpen(player)}
          >
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography variant="h5">{playerName}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: '#7687a8', padding: 0 }}>
              <List>{characterChildren}</List>
            </AccordionDetails>
          </Accordion>
        </ThemeProvider>
      );
    });

    return (
      <ThemeProvider theme={baseTheme}>
        <Fab
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          color="secondary"
          variant="circular"
          onClick={(event) => handleAddButtonClick(event)}
        >
          <Icon>add</Icon>
        </Fab>
        <Box sx={{ color: 'text.primary' }}>
          <Typography
            align="center"
            variant="h5"
            sx={{ position: 'relative', top: 10 }}
          >
            Character Select
          </Typography>
          <Typography
            align="center"
            variant="subtitle2"
            sx={{ position: 'relative', top: 10 }}
          >
            Show Hidden Characters{' '}
            <Switch
              onChange={(e) => handleShowHiddenSwitchClick(e)}
              color="secondary"
            />
          </Typography>
          <Button
            sx={{ width: 1, mt: 2, py: 1 }}
            type="button"
            size="small"
            id="backButton"
            variant="contained"
            color="secondary"
            onClick={() => handleDmViewClick()}
          >
            DM View
          </Button>
        </Box>
        <Box sx={{ position: 'relative', top: 18 }}>{playerChildren}</Box>
      </ThemeProvider>
    );
  }
}
