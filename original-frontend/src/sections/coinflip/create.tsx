import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// @mui
import { Stack, InputBase, IconButton, Button, Avatar, Typography } from '@mui/material';

// components
import Iconify from 'src/components/iconify';
import { useSelector } from 'src/store';
import { handleBetChange, validateBetAmount } from 'src/utils/bet-validation';
import { coinflipSocket } from './socket';

import TCoin from '../../assets/coinflip/t_coin.png';
import HCoin from '../../assets/coinflip/h_coin.png';

export default function CreateCoinflip() {
  const { isLoggedIn, balance, realBalance } = useSelector((state) => state.auth);

  const [betAmount, setBetAmount] = useState<string>("0.00");

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);

  const [selectedCoin, setSelectedCoin] = useState(true);

  const createBet = () => {
    if (!isLoggedIn) {
      toast.error('please login first!');
      return;
    }

    const betValue = Number(betAmount);
    if (!validateBetAmount(betValue, balance)) {
      return;
    }

    // multi create
    // if (games?.find((item: ICoinflipRoom) => item.creator._id === user._id))
    //   return enqueueSnackbar('Room is already created', { variant: 'error' });
    // if (games?.find((item: ICoinflipRoom) => item.joiner._id === user._id))
    //   return enqueueSnackbar('There is Room you already joined!', { variant: 'error' });
    const param = {
      amount: betAmount,
      side: selectedCoin,
    };

    coinflipSocket.emit('create-game', param);

    toast.success('New Room created!');
  };

  return (
    <Stack
      sx={{
        borderRadius: 1,
        bgcolor: 'rgba(255, 255, 255, 0.04)',
        boxShadow: `0px 0px 2px 0px rgba(0, 0, 0, 0.25)`,
        gap: 2,
        p: 1.5,
      }}
    >
      <Stack gap={0.4} width={1}>
        <Typography sx={{ fontSize: 11 }}>Bet Amount:</Typography>
        <Stack direction="row" width={1}>
          <InputBase
            color="primary"
            value={betAmount}
            onChange={onBetChange}
            placeholder="0.00"
            type="number"
            error={parseFloat(betAmount) <= 0 || true}
            inputProps={{ step: 0.01, min: 0 }}
            endAdornment={
              <Iconify
                icon="material-symbols:attach-money-rounded"
                sx={{ color: 'primary.main', minWidth: 20 }}
              />
            }
            sx={{
              width: 1,
              px: 1.25,
              py: 0.1,
              borderRadius: 0.5,
              height: 40,
              bgcolor: '#0f212e',
              border: '2px solid #2f4553',
            }}
          />
          <Stack sx={{ flexDirection: 'row', gap: 0.1 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 0.2,
                minWidth: 40,
                height: 40,
                width: 40,
                bgcolor: 'background.paper',
              }}
              onClick={() => setBetAmount((Number(betAmount) / 2).toFixed(2))}
            >
              1/2
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 0.2,
                minWidth: 40,
                height: 40,
                width: 40,
                bgcolor: 'background.paper',
              }}
              onClick={() => setBetAmount((Number(betAmount) * 2).toFixed(2))}
            >
              2x
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontSize: 11 }}>Select Coin:</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack sx={{ gap: 0.9, flexDirection: 'row' }}>
            <IconButton
              aria-label="fingerprint"
              color="success"
              onClick={() => setSelectedCoin(true)}
            >
              <Avatar
                sx={{
                  width: selectedCoin ? 50 : 40,
                  height: selectedCoin ? 50 : 40,
                  opacity: selectedCoin ? 1 : 0.7,
                }}
                src={TCoin}
              />
            </IconButton>
            <IconButton
              aria-label="fingerprint"
              color="success"
              onClick={() => setSelectedCoin(false)}
            >
              <Avatar
                sx={{
                  width: !selectedCoin ? 50 : 40,
                  height: !selectedCoin ? 50 : 40,
                  opacity: !selectedCoin ? 1 : 0.7,
                }}
                src={HCoin}
              />
            </IconButton>
          </Stack>
          <Button variant="contained" color="primary" sx={{ py: 1.5, px: 2.5 }} onClick={createBet}>
            Create Game
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
