import { useEffect, useState } from 'react';
import moment from 'moment';
import { Typography } from '@mui/material';

const Timer = () => {
  const [formattedTime, setFormattedTime] = useState<string>('');

  const setTime = () => {
    const time = moment().format('HH:mm MM/DD/YYYY');
    setFormattedTime(time);
  };

  useEffect(() => {
    setTime();
    setInterval(() => {
      setTime();
    }, 60 * 1000);
  }, []);

  return (
    <Typography fontSize={12} fontWeight={400} color="#C5C6CB">
      {formattedTime}
    </Typography>
  );
};

export default Timer;
