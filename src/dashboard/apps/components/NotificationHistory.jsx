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

  function handlePageChange(event, value) {
    setCurrentPage(value);
  }

  if (notifications) {
    const playerNotes = notifications[activePlayer];

    const noteItemArrayFull = playerNotes.map((note) => (
      <Item key={note.timestamp}>
        <Typography>{note.message}</Typography>
        <Typography variant="subtitle2" align="right">
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

    return (
      <Box>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => handlePageChange(event, value)}
          color="secondary"
        />
        <Stack spacing={1}>{noteItemChunks[currentPage - 1]}</Stack>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => handlePageChange(event, value)}
          color="secondary"
        />
      </Box>
    );
  }
  return null;
}
