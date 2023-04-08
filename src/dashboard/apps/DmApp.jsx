/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

// Ours
import HealthBar from './components/HealthBar';
import NotificationHistory from './components/NotificationHistory';

export default function DmApp(props) {
  // Props
  const { appSetter, characters, players, notifications } = props;

  // States
  const [activeCharsArray, setActiveCharsArray] = React.useState([]);

  // Effects
  React.useEffect(() => {
    function getActiveCharsFromReplicant(replicant) {
      const fullPlayerList = Object.keys(replicant);
      const result = [];

      fullPlayerList.forEach((player) => {
        if (players[player].activeCharacter !== 0) {
          result.push(players[player].activeCharacter);
        }
      });

      return result;
    }

    setActiveCharsArray(getActiveCharsFromReplicant(players));
  }, [players]);

  // Handlers
  function handleBackButtonClick() {
    appSetter('select');
  }

  const playerStatusBars = activeCharsArray.map((charId) => {
    const { avatarUrl, fullName } = characters[charId].data;
    const {
      current: currentHp,
      max: maxHp,
      temp: tempHp,
      tempMax,
    } = characters[charId].data.hp;
    const currentAc = characters[charId].data.ac.base;
    const playerName = characters[charId].player;
    const { micEnabled } = players[playerName].mixer;

    return (
      <Grid item xs key={charId}>
        <HealthBar
          currentHp={currentHp}
          maxHp={maxHp}
          tempHp={tempHp}
          tempMax={tempMax}
          currentAc={currentAc}
          avatarUrl={avatarUrl}
          fullName={fullName}
          micEnabled={micEnabled}
        />
      </Grid>
    );
  });

  return (
    <Box sx={{ width: 1, flexGrow: 1 }}>
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
      <Grid container>
        {playerStatusBars.length > 0 ? playerStatusBars : null}
      </Grid>
      <hr />
      <Grid container sx={{ backgroundColor: '#525f78' }} alignItems="stretch">
        <Grid item xs={8}>
          <div style={{ resize: 'vertical', overflow: 'hidden' }}>
            <iframe
              title="chat"
              src="https://showmy.chat/c/arcanarama?showCommands=true"
              width="98%"
              height="99%"
            />
          </div>
        </Grid>
        <Grid item xs>
          <NotificationHistory
            activePlayer="Cameron"
            notifications={notifications}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
