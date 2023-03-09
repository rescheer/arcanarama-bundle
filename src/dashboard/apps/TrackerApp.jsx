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
import HealthManager from './components/HealthManager';
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
  const { characters, appSetter, charSetter, activeChar } = props;
  let character;
  let characterIndex;

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

  // Propogate changes to all connected clients
  React.useEffect(() => {
    setCurrentHpState(characters[characterIndex].data.hp.current);
    setTempHpState(characters[characterIndex].data.hp.temp);
    setTempMaxState(characters[characterIndex].data.hp.tempMax);
    setMaxHpState(characters[characterIndex].data.hp.max);
  }, [characters, characterIndex]);

  function setCurrentHp(newVal) {
    setCurrentHpState(newVal);
    character.data.hp.current = newVal;
  }

  function setTempHp(newVal) {
    setTempHpState(newVal);
    character.data.hp.temp = newVal;
  }

  function setMaxHp(newVal) {
    if (currentHp < newVal) {
      setMaxHpState(newVal);
      character.data.hp.max = newVal;
    } else {
      setMaxHpState(newVal);
      character.data.hp.max = newVal;
      setCurrentHp(newVal);
    }
  }

  function setTempMax(newVal) {
    setTempMaxState(newVal);
    character.data.hp.tempMax = newVal;
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

    if (tempHp > 0 && deltaHp < 0) {
      if (Math.abs(deltaHp) > +tempHp) {
        setTempHp(0);
        deltaHp += +tempHp;
      } else {
        setTempHp(+tempHp + +deltaHp);
        deltaHp = 0;
      }
    }

    const newHp = +oldHp + +deltaHp;

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
            icon={<Icon>refresh</Icon>}
            tooltipTitle="Refresh"
            tooltipOpen
            sx={{ color: 'black' }}
            onClick={(event) => handleRefreshButtonClick(event)}
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
      <HealthManager
        handleHpChange={(newVal) => handleHpChange(newVal)}
        setMaxHp={(newVal) => setMaxHp(newVal)}
        handleTempHpChange={(newVal) => handleTempHpChange(newVal)}
        inputValue={inputValue}
        handleKeypadClick={(i, e) => handleKeypadClick(i, e)}
      />
    </ThemeProvider>
  );
}
