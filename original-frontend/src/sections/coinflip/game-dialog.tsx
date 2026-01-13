import React, { useEffect, useState } from 'react';
import { Stack, Button, Dialog, Avatar, Typography, IconButton, DialogTitle, Box, Badge } from '@mui/material';
import { useSelector } from 'src/store';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { GameDialogProps, ICoinflipRoom } from './types';

import unknownImg from '../../assets/coinflip/user.png';
import TCoin from '../../assets/coinflip/t_coin.png';
import HCoin from '../../assets/coinflip/h_coin.png';

import Tails1Video from '../../assets/coinflip/Tails1.mp4';
import Heads1Video from '../../assets/coinflip/Heads1.mp4';
import Tails2Video from '../../assets/coinflip/Tails2.mp4';
import Heads2Video from '../../assets/coinflip/Heads2.mp4';

/* eslint-disable */
const ResultVideoComponent = ({ data }: { data: ICoinflipRoom }) => {
  const videoRef: any = React.useRef(null);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    if (
      (data.side === true && data.result === 'creator') ||
      (data.side === false && data.result === 'joiner')
    ) {
      if (Math.round(Math.random()) === 0) setResult(1);
      else setResult(2);
    } else if (
      (data.side !== true && data.result === 'creator') ||
      (data.side !== false && data.result === 'joiner')
    ) {
      if (Math.round(Math.random()) === 0) setResult(3);
      else setResult(4);
    }
  }, [data]);

  useEffect(() => {
    if (result > 0) {
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    }
  }, [result]);

  return (
    <>
      {result !== 0 && (
        <video ref={videoRef} width="320px" height="240px" autoPlay
          muted>
          {result === 1 && <source src={Tails1Video} type="video/mp4" />}
          {result === 2 && <source src={Tails2Video} type="video/mp4" />}
          {result === 3 && <source src={Heads1Video} type="video/mp4" />}
          {result === 4 && <source src={Heads2Video} type="video/mp4" />}
        </video>
      )}
    </>
  );
};

const GameDialog = ({ open, onClose, data }: GameDialogProps) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Dialog
      open={open}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: { xm: 1, sm: 1, md: 770 },
          height: 0.5,
          width: 1,
          position: `relative`,
        },
      }}
    >
      <IconButton
        aria-label="close"
        sx={{ position: 'absolute', top: 1, right: 1.25, zIndex: 100 }}
        onClick={onClose}
      >
        <Iconify icon="mdi:close" />
      </IconButton>
      <Stack
        sx={{
          width: 1,
          height: data.state === "not" ? 0.8 : 0.3,
          flexDirection: 'row',
        }}
      >
        <Stack
          sx={{
            width: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack sx={{ gap: 1.6, alignItems: 'center' }}>
            <Badge
              badgeContent={
                <Box
                  component="img"
                  alt=""
                  src={data.side === true ? TCoin : HCoin}
                  style={{ width: 25, height: 25 }}
                />
              }
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt={data.creator.first_name}
                src={data.creator.avatar}
                sx={{
                  width: data.state === "not" ? 100 : 50, height: data.state === "not" ? 100 : 50,
                  ...(data.state === "end" && {
                    border: `2px solid ${data.result === "creator" ? "#78ff0d" : "grey"}`
                  })
                }}
              />
            </Badge>
            <TextMaxLine fontSize={14} line={1} >
              {`${data.creator.first_name} ${data.creator.last_name}`}
            </TextMaxLine>
          </Stack>
        </Stack>
        <Stack
          sx={{
            width: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack sx={{ gap: 1.6, alignItems: 'center' }}>
            <Badge
              badgeContent={
                <Box
                  component="img"
                  alt=""
                  src={data.side === false ? TCoin : HCoin}
                  style={{ width: 25, height: 25 }}
                />
              }
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt={!data?.joiner?._id ? data.creator.first_name : data.joiner.first_name}
                src={!data?.joiner?._id ? unknownImg : data.joiner.avatar}
                sx={{
                  width: data.state === "not" ? 100 : 50, height: data.state === "not" ? 100 : 50,
                  ...(data.state === "end" && {
                    border: `2px solid ${data.result === "joiner" ? "#78ff0d" : "grey"}`
                  })
                }}
              />
            </Badge>

            <TextMaxLine fontSize={14} line={1} >
              {!data?.joiner?._id ? 'Waiting...' : `${data.joiner?.first_name} ${data.joiner?.last_name}`}
            </TextMaxLine>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
        }}
      >
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: 1,
            height: 1,
          }}
        >
          {data.state === 'end' && <ResultVideoComponent data={data} />}
          {/* <Stack
            sx={{
              position: 'absolute',
              alignItems: 'center',
              bottom: '2%',
              display: 'flex',
              flexDirection: 'row',
              gap: '30px',
              width: 1,
            }}
          >
            <Typography sx={{ fontSize: '11px', opacity: '0.3', flex: '1', textAlign: 'right' }}>
              Seed: {data?.api?.id}
            </Typography>
            <Typography sx={{ fontSize: '11px', opacity: '0.3', flex: '1' }}>
              Hash: {data?.api?.result?.signature.slice(0, 33) ?? ''}
            </Typography>
          </Stack> */}
          {data.state === 'not' && (
            <Stack
              sx={{
                position: 'absolute',
                alignItems: 'center',
                bottom: '20%',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
              }}
            >
              <Stack
                alignItems="center"
                display="flex"
                justifyContent="center"
                gap={2}
                flexDirection="column"
              >
                <Button
                  disabled={data.creator._id === user._id}
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ minWidth: 150, }}
                >
                  {`$${data.amount}`}

                  <Box
                    component="img"
                    alt=""
                    src={data.side !== true ? TCoin : HCoin}
                    sx={{
                      width: 24, height: 24, ml: 1,
                      borderRadius: 50,
                    }}
                  />
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
        <DialogTitle />
      </Stack>
    </Dialog>
  );
};

export default GameDialog;
