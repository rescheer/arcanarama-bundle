/* eslint-disable no-unused-vars */
import * as React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';

// eslint-disable-next-line no-unused-vars
export default function ItemList(props) {
  const [sponsors, setSponsors] = React.useState(false);
  const [giveaways, setGiveaways] = React.useState(false);
  const [characters, setCharacters] = React.useState(false);
  const [others, setOthers] = React.useState(false);

  const toggleSponsors = () => {
    setSponsors(!sponsors);
  };

  const toggleGiveaways = () => {
    setGiveaways(!giveaways);
  };

  const toggleCharacters = () => {
    setCharacters(!characters);
  };

  const toggleOthers = () => {
    setOthers(!others);
  };

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Utility Items
        </ListSubheader>
      }
    >
      <ListItemButton onClick={toggleSponsors}>
        <Icon>paid</Icon>
        <ListItemText primary="Sponsors" />
        {sponsors ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
      </ListItemButton>
      <Collapse in={sponsors} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Content goes in this list */}
        </List>
      </Collapse>

      <ListItemButton onClick={toggleGiveaways}>
        <Icon>shopping_cart</Icon>
        <ListItemText primary="Giveaways" />
        {giveaways ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
      </ListItemButton>
      <Collapse in={giveaways} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Content goes in this list */}
        </List>
      </Collapse>

      <ListItemButton onClick={toggleCharacters}>
        <Icon>people</Icon>
        <ListItemText primary="Character Cards" />
        {characters ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
      </ListItemButton>
      <Collapse in={characters} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Content goes in this list */}
        </List>
      </Collapse>

      <ListItemButton onClick={toggleOthers}>
        <Icon>people</Icon>
        <ListItemText primary="Other" />
        {others ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
      </ListItemButton>
      <Collapse in={others} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Content goes in this list */}
        </List>
      </Collapse>
    </List>
  );
}
