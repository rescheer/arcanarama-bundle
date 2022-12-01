/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Icon from '@mui/material/Icon';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ScrollableTabsButtonAuto(props) {
  const [value, setValue] = React.useState(-1);
  const [giveawayName, setGiveawayName] = React.useState('');

  const { giveawayRep } = props;
  const { chatConnected } = props.statusRep;
  const keyArray = Object.keys(giveawayRep);
  const keyTabs = [];
  const tabPanels = [];

  const lastIndex = keyArray.length;
  const chatStatusProp = !chatConnected;
  const errorMsg = chatConnected
    ? ''
    : 'Chat not connected! Check NodeCG-IO Tab';

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNameChange = (event) => {
    setGiveawayName(event.target.value);
  };

  const handleActiveToggle = (id) => {
    const data = { toggle: { key: id } };
    window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
  };

  const handleAnnouncement = (id) => {
    const data = { announce: { key: id } };
    window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
  };

  const handleWinnerAnnounce = (key, user) => {
    const data = { announceWinner: { key, user } };
    window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
  };

  const handleDraw = (id) => {
    const data = { draw: { key: id } };
    window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
  };

  const handleEdit = (id) => {
    const data = { set: { key: id } };
    window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
  };

  const handleDelete = (id) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm(`Delete giveaway "${id}"?`)) {
      const data = { delete: { key: id } };
      window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
      setValue(-1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('name');
    const keyword = formData.get('keyword');

    const data = { add: { key: keyword, name: fullName, active: false } };
    window.nodecg.sendMessageToBundle('giveaway', 'autonorama-bundle', data);
    setGiveawayName('');
    setValue(lastIndex + 1);
  };

  // Create Add Button at start of tabs
  keyTabs.push(
    <Tab
      icon={<Icon>add</Icon>}
      key="addButton"
      value={-1}
      sx={{ pl: 0, pr: 0, minWidth: 45 }}
    />
  );

  // And create it's corresponding panel
  tabPanels.push(
    <Box
      key="addButtonPanel"
      sx={{
        bgcolor: '#202837',
        pt: 0,
      }}
    >
      <TabPanel value={value} index={-1} align="center">
        <Box component="form" onSubmit={handleSubmit}>
          <Button
            id="witchlight"
            size="small"
            variant="contained"
            color="info"
            onClick={(e) =>
              setGiveawayName('More Fun Mystery Box - Witchlight', e)
            }
          >
            Quick Witchlight
          </Button>
          <Button
            size="small"
            id="snowbound"
            variant="contained"
            color="info"
            onClick={(e) =>
              setGiveawayName('More Fun Mystery Box - Snowbound', e)
            }
          >
            Quick Snowbound
          </Button>
          <br />
          <TextField
            id="name"
            name="name"
            label="Giveaway Name"
            required
            inputProps={{ inputMode: 'text' }}
            color="secondary"
            variant="filled"
            InputLabelProps={{ shrink: true }}
            value={giveawayName}
            onChange={(e) => handleNameChange(e)}
            sx={{ my: 1, width: 0.6, maxWidth: 350 }}
          />
          <br />
          <TextField
            id="keyword"
            name="keyword"
            label="Keyword"
            required
            helperText="Letters and numbers only"
            inputProps={{ inputMode: 'text', pattern: '^[a-zA-Z0-9]+$' }}
            InputLabelProps={{ shrink: true }}
            color="secondary"
            variant="filled"
            sx={{ mb: 1, width: 0.4, maxWidth: 200 }}
          />
          <br />
          <Button
            sx={{ width: 0.35 }}
            type="submit"
            id="submitButton"
            variant="contained"
            color="secondary"
          >
            Add Giveaway
          </Button>
        </Box>
      </TabPanel>
    </Box>
  );

  // Iterate through the replicant
  if (keyArray.length !== 0) {
    keyArray.forEach((key) => {
      const index = keyArray.indexOf(key) + 1;
      const name = giveawayRep[key].name;
      const active = giveawayRep[key].active;
      const numEntries = giveawayRep[key].entries.length;
      const winners = giveawayRep[key].winner;
      const winnerList = [];
      const finalWinner = giveawayRep[key].finalWinner;
      const winnerText = winners.length !== 0 ? 'Winners' : '';

      // Build winner list
      winners.forEach((user) => {
        let winnerBG = '';
        if (user === finalWinner) {
          winnerBG = 'green';
        }
        winnerList.push(
          <ListItem
            key={user}
            sx={{
              borderBottom: 1,
              borderColor: 'white',
              bgcolor: winnerBG,
            }}
            secondaryAction={
              <Button
                edge="end"
                variant="contained"
                color="secondary"
                disabled={chatStatusProp}
                onClick={(e) => handleWinnerAnnounce(key, user, e)}
              >
                <Icon>campaign</Icon>
              </Button>
            }
          >
            <ListItemText primary={user} />
          </ListItem>
        );
      });

      // Build Tabs
      keyTabs.push(<Tab label={key} key={key} value={index} />);

      // Build Panels
      tabPanels.push(
        <Box
          key={key}
          sx={{
            bgcolor: '#202837',
            p: 0,
          }}
        >
          <TabPanel value={value} index={index}>
            <Typography align="center" variant="h5">
              {name}
            </Typography>
            <Grid container spacing={0}>
              <Grid item xs={12} align="center" sx={{ my: 1 }}>
                <Typography variant="body1" color="error">
                  {errorMsg}
                </Typography>
                <Button
                  sx={{ width: 0.25 }}
                  id={`${key}-announce`}
                  variant="contained"
                  color="secondary"
                  disabled={chatStatusProp}
                  onClick={(e) => handleAnnouncement(key, e)}
                >
                  <Icon>campaign</Icon>
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <Box
                  sx={{
                    mb: 1,
                    border: 1,
                    borderColor: 'white',
                    width: '0.25',
                  }}
                >
                  <Typography variant="h3">{numEntries}</Typography>
                  <Typography variant="body1">Entries</Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                align="center"
                sx={{ borderBottom: 1, borderColor: 'white', pb: 1 }}
              >
                <Button
                  sx={{ width: 0.35 }}
                  id={`${key}-draw`}
                  variant="contained"
                  color="secondary"
                  onClick={(e) => handleDraw(key, e)}
                >
                  Draw
                </Button>
              </Grid>
              <Grid
                item
                xs={7}
                align="center"
                sx={{ borderBottom: 1, borderColor: 'white', py: 1 }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={active}
                        onChange={(e) => handleActiveToggle(key, e)}
                        color="secondary"
                        id={`${key}-toggle`}
                      />
                    }
                    label="Accept Entries"
                    labelPlacement="end"
                  />
                </FormGroup>
              </Grid>
              <Grid
                item
                xs={5}
                align="right"
                sx={{ borderBottom: 1, borderColor: 'white', py: 1 }}
              >
                <Button
                  id={`${key}-edit`}
                  variant="contained"
                  color="secondary"
                  disabled
                  onClick={(e) => handleEdit(key, e)}
                >
                  <Icon>edit</Icon>
                </Button>
                <Button
                  id={`${key}-delete`}
                  variant="contained"
                  color="error"
                  onClick={(e) => handleDelete(key, e)}
                >
                  <Icon>delete</Icon>
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography variant="h6">{winnerText}</Typography>
                <List>{winnerList}</List>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      );
    });
  }

  return (
    <Box
      sx={{
        bgcolor: '#525f78',
        pt: 1,
        color: 'text.primary',
        maxWidth: 600,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {keyTabs}
      </Tabs>
      {tabPanels}
    </Box>
  );
}

export default function GiveawayApp(props) {
  const { giveawayRep } = props;
  if (typeof giveawayRep === 'object') {
    return <ScrollableTabsButtonAuto {...props} />;
  }
}
