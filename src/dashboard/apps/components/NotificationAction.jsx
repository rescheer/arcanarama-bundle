/* eslint-disable react/prop-types */
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import CircularProgress from '@mui/material/CircularProgress';

export default function NotificationTimed(props) {
  const { text, duration, closeSnackbar } = props;
  const UPDATE_MS = 30;

  const step = duration / (duration / UPDATE_MS);

  const [progress, setProgress] = React.useState(duration * 0.95);
  const normalize = (value) => Math.floor((value * 100) / duration);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress <= 0 ? 0 : prevProgress - step
      );
    }, UPDATE_MS);

    if (progress <= 0) {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [duration, progress, step]);

  const noteCloseAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      value={text}
      onClick={(e) => closeSnackbar(e.currentTarget.value)}
    >
      <CircularProgress
        variant="determinate"
        color="inherit"
        value={normalize(progress)}
        sx={{ position: 'absolute' }}
      />
      <Icon fontSize="large">close</Icon>
    </IconButton>
  );

  return noteCloseAction;
}
