/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Ours
import getRelativeTimeString from '../../utils/Common';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function NotificationHistory(props) {
  const { activePlayer, notifications } = props;
  const itemsPerPage = 5;
  let totalPages = 1;
  let content;

  const [currentPage, setcurrentPage] = React.useState(1);

  function handlePageChange(event, value) {
    setcurrentPage(value);
  }

  if (notifications) {
    if (!notifications[activePlayer]) {
      notifications[activePlayer] = [];
    }
    const playerNotes = notifications[activePlayer];

    const noteItemArrayFull = playerNotes.map((note) => (
      <Item key={note.timestamp}>
        <Typography>{note.message}</Typography>
        <Typography variant="caption" align="right">
          {getRelativeTimeString(note.timestamp)}
        </Typography>
      </Item>
    ));
    noteItemArrayFull.reverse();

    const noteItemChunks = [];
    for (let i = 0; i < noteItemArrayFull.length; i += itemsPerPage) {
      const chunk = noteItemArrayFull.slice(i, i + itemsPerPage);
      noteItemChunks.push(chunk);
    }
    totalPages = noteItemChunks.length;

    if (noteItemArrayFull.length > 0) {
      content = (
        <Box>
          <Typography align="center" variant="h5">
            Page {currentPage}
          </Typography>
          <Stack>{noteItemChunks[currentPage - 1]}</Stack>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => handlePageChange(event, value)}
            color="secondary"
          />
        </Box>
      );
    } else {
      content = (
        <Box>
          <Typography align="center">
            Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
          </Typography>
          <Stack>
            <Item>No notifications yet.</Item>
          </Stack>
          <Pagination disabled color="secondary" />
        </Box>
      );
    }

    return content;
  }
  return null;
}
