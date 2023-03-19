/* eslint-disable react/prop-types */
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

// Ours
import StatusManager from './components/StatusManager';
import HealthBar from './components/HealthBar';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#2f3a4f',
    },
    secondary: {
      main: '#00bebe',
    },
    success: {
      main: '#40bf40',
    },
    info: {
      main: '#0244f1',
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(0, 0, 0, 0.7)',
    },
    background: {
      paper: '#009797',
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
});

export default function TrackerApp(props) {
  const { characters, appSetter, charSetter, activeChar, trackerPage } = props;
  let character;
  let characterIndex;
  let pageComponent;

  // Config
  const BIO_YPOSITION = 2;

  characters.forEach((char, index) => {
    if (+activeChar === +char.ddbID) {
      character = characters[index];
      characterIndex = index;
    }
  });

  const { fullName, avatarUrl, hp } = character.data;

  const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('0');
  const [currentHp, setCurrentHpState] = React.useState(hp.current);
  const [maxHp, setMaxHpState] = React.useState(hp.max);
  const [tempHp, setTempHpState] = React.useState(hp.temp);
  const [tempMax, setTempMaxState] = React.useState(0);

  // When another client changes the replicant, update states from it
  React.useEffect(() => {
    setCurrentHpState(characters[characterIndex].data.hp.current);
    setTempHpState(characters[characterIndex].data.hp.temp);
    setTempMaxState(characters[characterIndex].data.hp.tempMax);
    setMaxHpState(characters[characterIndex].data.hp.max);
  }, [characters, characterIndex]);

  function setCurrentHp(newVal) {
    setCurrentHpState(newVal);
    characters[characterIndex].data.hp.current = newVal;
  }

  function setTempHp(newVal) {
    setTempHpState(newVal);
    characters[characterIndex].data.hp.temp = newVal;
  }

  function setMaxHp(newVal) {
    if (currentHp < newVal) {
      setMaxHpState(newVal);
      characters[characterIndex].data.hp.max = newVal;
    } else {
      setMaxHpState(newVal);
      characters[characterIndex].data.hp.max = newVal;
      setCurrentHp(newVal);
    }
  }

  function setTempMax(newVal) {
    setTempMaxState(newVal);
    characters[characterIndex].data.hp.tempMax = newVal;
  }

  const handleOpen = () => setSpeedDialOpen(true);
  const handleClose = () => setSpeedDialOpen(false);

  function handleBackButtonClick() {
    window.localStorage.removeItem('storedChar');
    charSetter(undefined);
    appSetter('select');
  }

  function handleRefreshButtonClick() {
    if (character) {
      window.nodecg.sendMessage('character', { refresh: { character } });
      handleClose();
    }
  }

  function handleResetButtonClick() {
    if (character) {
      window.nodecg.sendMessage('character', { reparse: { character } });
      handleClose();
    }
  }

  function handleRemoveButtonClick() {
    if (character) {
      handleClose();
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (confirm(`Remove ${character.data.fullName}?`)) {
        window.nodecg.sendMessage('character', { delete: { character } });
        handleBackButtonClick();
      }
    }
  }

  function handleKeypadClick(e) {
    const newValue = e.currentTarget.value;

    if (newValue) {
      switch (newValue) {
        case 'clear':
          if (inputValue !== '0') {
            setInputValue('0');
          }
          break;
        case 'backspace':
          if (inputValue.length > 1) {
            const newStr = inputValue.slice(0, inputValue.length - 1);
            setInputValue(newStr);
          } else {
            setInputValue('0');
          }
          break;
        default:
          if (inputValue === '0') {
            setInputValue(`${newValue}`);
          } else {
            setInputValue(`${inputValue}${newValue}`);
          }
          break;
      }
    }
  }

  function handleHpChange(e) {
    const multiplier = e.currentTarget.value;
    let deltaHp = inputValue * multiplier;
    const oldHp = currentHp;
    let newHp = 0;

    // Process temp hp
    if (tempHp > 0 && deltaHp < 0) {
      if (Math.abs(deltaHp) > +tempHp) {
        setTempHp(0);
        deltaHp += +tempHp;
      } else {
        setTempHp(+tempHp + +deltaHp);
        deltaHp = 0;
      }
    }

    // Handle healing from negative HP
    if (+oldHp <= 0 && +deltaHp > 0) {
      newHp = +deltaHp;
    } else {
      newHp = +oldHp + +deltaHp;
    }

    if (newHp > maxHp) {
      setCurrentHp(maxHp);
    } else if (newHp <= 0) {
      setCurrentHp(newHp);
      // handle death
    } else {
      setCurrentHp(newHp);
    }
    setInputValue('0');
  }

  function handleTempHpChange() {
    setTempMax(inputValue);
    setTempHp(inputValue);
    setInputValue('0');
  }

  switch (trackerPage) {
    case 2:
      // Settings
      pageComponent = null;
      break;
    case 1:
      // More
      pageComponent = null;
      break;
    default:
      // Hit Points
      pageComponent = (
        <StatusManager
          handleHpChange={(newVal) => handleHpChange(newVal)}
          setMaxHp={(newVal) => setMaxHp(newVal)}
          handleTempHpChange={(newVal) => handleTempHpChange(newVal)}
          inputValue={inputValue}
          handleKeypadClick={(i, e) => handleKeypadClick(i, e)}
        />
      );
      break;
  }

  return (
    <ThemeProvider theme={baseTheme}>
      <Box key="main">
        <Backdrop open={speedDialOpen} sx={{ zIndex: 100 }} />

        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{
            position: 'absolute',
            mt: 1,
            mr: 1,
            right: 0,
          }}
          icon={<Icon>menu</Icon>}
          onClose={handleClose}
          onOpen={handleOpen}
          direction="down"
          open={speedDialOpen}
          FabProps={{
            color: 'secondary',
            size: 'small',
          }}
        >
          <SpeedDialAction
            key="refresh"
            icon={<Icon>sync</Icon>}
            tooltipTitle="Refresh"
            tooltipOpen
            onClick={(event) => handleRefreshButtonClick(event)}
          />
          <SpeedDialAction
            key="reset"
            icon={<Icon>replay</Icon>}
            tooltipTitle="Reset"
            tooltipOpen
            onClick={(event) => handleResetButtonClick(event)}
          />
          <SpeedDialAction
            key="remove"
            icon={<Icon color="error">delete</Icon>}
            tooltipTitle="Remove"
            tooltipOpen
            FabProps={{
              color: 'red',
              size: 'small',
            }}
            onClick={(event) => handleRemoveButtonClick(event)}
          />
        </SpeedDial>

        <Button
          sx={{
            position: 'absolute',
            left: -3,
            mt: 1,
            mb: 1,
            py: 1,
            zIndex: 90,
          }}
          type="button"
          size="small"
          id="backButton"
          variant="contained"
          color="primary"
          onClick={(event) => handleBackButtonClick(event)}
        >
          <Icon>arrow_back</Icon>
        </Button>
        <Box sx={{ color: 'text.primary' }}>
          <img
            src={avatarUrl}
            alt="avatar"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              margin: 'auto',
              width: '25%',
              maxWidth: 100,
              borderRadius: '50%',
            }}
          />
          <Typography
            align="center"
            noWrap
            variant="h5"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
              top: BIO_YPOSITION + 43,
              textShadow: '2px 2px 4px black',
            }}
          >
            {fullName}
          </Typography>
        </Box>
      </Box>
      <HealthBar
        currentHp={currentHp}
        maxHp={maxHp}
        tempHp={tempHp}
        tempMax={tempMax}
      />
      {pageComponent}
    </ThemeProvider>
  );
}
