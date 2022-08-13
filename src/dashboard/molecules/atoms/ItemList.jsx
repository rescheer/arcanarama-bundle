import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

// eslint-disable-next-line no-unused-vars
export default function ItemList(props) {
  // const [selectedToEdit, setSelectedToEdit] = React.useState([0]);

  return (
    <List sx={{ width: '50%', bgcolor: 'background.paper' }}>
      {[0, 1, 2, 3].map((element) => {
        const labelId = `item-list-label-${element}`;

        return (
          <div key={element}>
            <ListItem
              secondaryAction={
                <div>
                  <IconButton edge="start" aria-label="edit">
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <Icon>delete</Icon>
                  </IconButton>
                </div>
              }
              disablePadding
              divider
            >
              <ListItemButton
                role={undefined}
                // onClick={handleShowFullsize(element)}
                dense
              >
                <Avatar
                  variant="rounded"
                  alt="Test Item"
                  src="../../../assets/arcanarama-bundle/assetUtilSponsors/moreFunLogo.png"
                  sx={{
                    width: 0.2,
                    minWidth: 35,
                    maxWidth: 65,
                    height: 0.2,
                    minHeight: 35,
                    maxHeight: 65,
                    mr: 1,
                  }}
                />
                <ListItemText
                  id={labelId}
                  primary={`Line item ${element + 1}`}
                />
              </ListItemButton>
            </ListItem>
          </div>
        );
      })}
    </List>
  );
}
