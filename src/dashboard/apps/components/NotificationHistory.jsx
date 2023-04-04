/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Ours
import getRelativeTimeString from '../../utils/Common';

const Item = styled(Paper)(({ theme, ...props }) => ({
  backgroundColor:
    props.variant === 'default' ? '#fff' : theme.palette[props.variant].main,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary,
}));

export default function NotificationHistory(props) {
  const { activePlayer, notifications } = props;
  const itemsPerPage = 5;
  let totalPages = 1;

  const [currentPage, setCurrentPage] = React.useState(1);
  const [, setTime] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function handlePageChange(event) {
    const action = event.currentTarget.value;
    let newPage = 1;

    switch (action) {
      case 'first':
        if (currentPage !== 1) newPage = 1;
        break;
      case 'prev':
        if (currentPage !== 1) newPage = currentPage - 1;
        break;
      case 'next':
        if (currentPage !== totalPages) newPage = currentPage + 1;
        break;
      case 'last':
        if (currentPage !== totalPages) newPage = totalPages;
        break;
      default:
        break;
    }
    setCurrentPage(newPage);
  }

  if (notifications) {
    const playerNotes = notifications[activePlayer];

    const noteItemArrayFull = playerNotes.map((note) => (
      <Item key={note.timestamp} variant={note.variant}>
        <Typography variant="caption" align="left">
          Sent to: {note.isGlobalNotification ? 'All' : note.sentTo.join(', ')}
        </Typography>
        <Typography>{note.text}</Typography>
        <Typography variant="body2" align="right">
          {getRelativeTimeString(note.timestamp)}
        </Typography>
      </Item>
    ));
    noteItemArrayFull.reverse();

    if (noteItemArrayFull.length === 0) {
      noteItemArrayFull.push(
        <Item key="emptyItem">No notifications yet.</Item>
      );
    }

    const noteItemChunks = [];
    for (let i = 0; i < noteItemArrayFull.length; i += itemsPerPage) {
      const chunk = noteItemArrayFull.slice(i, i + itemsPerPage);
      noteItemChunks.push(chunk);
    }
    totalPages = noteItemChunks.length;

    const buttonSpacing = 1;
    const buttonProps = { mx: buttonSpacing, my: 1, px: 0.6, minWidth: 0 };
    const paginationObject = (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button
          value="first"
          onClick={(event) => handlePageChange(event)}
          disabled={currentPage === 1}
          variant="outlined"
          sx={buttonProps}
        >
          <Icon>first_page</Icon>
        </Button>
        <Button
          value="prev"
          onClick={(event) => handlePageChange(event)}
          disabled={currentPage === 1}
          variant="outlined"
          sx={buttonProps}
        >
          <Icon>navigate_before</Icon>
        </Button>
        <Button
          value="next"
          onClick={(event) => handlePageChange(event)}
          disabled={currentPage === totalPages}
          variant="outlined"
          sx={buttonProps}
        >
          <Icon>navigate_next</Icon>
        </Button>
        <Button
          value="last"
          onClick={(event) => handlePageChange(event)}
          disabled={currentPage === totalPages}
          variant="outlined"
          sx={buttonProps}
        >
          <Icon>last_page</Icon>
        </Button>
        <Typography variant="subtitle2" sx={{ pb: 1 }}>
          Page {currentPage} of {totalPages}
        </Typography>
      </Box>
    );

    return (
      <Box sx={{ padding: 1 }}>
        {paginationObject}
        <Stack spacing={1}>{noteItemChunks[currentPage - 1]}</Stack>
        {paginationObject}
      </Box>
    );
  }
  return null;
}
