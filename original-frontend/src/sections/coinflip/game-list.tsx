// @mui
import toast from 'react-hot-toast';
import { Box, Card, Stack, Badge, Button, Avatar, Typography, IconButton, Paper, Tooltip, Divider } from '@mui/material';
import { CardProps } from '@mui/material/Card';

// components
import { useSelector } from 'src/store';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { coinflipSocket } from './socket';
import { ICoinflipRoom } from './types';

import unknownImg from '../../assets/coinflip/user.png';
import TCoin from '../../assets/coinflip/t_coin.png';
import HCoin from '../../assets/coinflip/h_coin.png';

interface ListProps extends CardProps {
  games: ICoinflipRoom[];
  openView: (selected: ICoinflipRoom) => void;
}

type GameListRowProps = {
  row: ICoinflipRoom;
  openView: (selected: ICoinflipRoom) => void;
};

export default function GameListComponent({ games, openView, ...other }: ListProps) {
  return (
    <Scrollbar sx={{ height: 1 }}>
      <Card
        {...other}
        sx={{
          background: `transparent`,
          borderRadius: 0.5
        }}
      >
        <Scrollbar>
          <Stack gap={1}>
            {games.length > 0 &&
              games.map((row: ICoinflipRoom, index: number) => (
                <GameListRow key={index} row={row} openView={openView} />
              ))}
          </Stack>
        </Scrollbar>
      </Card>
    </Scrollbar>
  );
}

function GameListRow({ row, openView }: GameListRowProps) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const joinRoom = () => {
    if (!isLoggedIn) {
      toast.error('Need login to join game');
      return;
    }
    if (user.balance < row.amount) {
      toast.error('Not enough funds!');
      return;
    }

    // if (
    //   user._id === row.creator._id
    //   // || multi join
    //   // games.find((item: ICoinflipRoom) => item.creator._id === user._id) ||
    //   // games.find((item: ICoinflipRoom) => item.joiner._id === user._id)
    // ) {
    //   return null;
    // }
    coinflipSocket.emit("join-game", row._id);
  };

  const ViewGame = () => {
    openView(row);
  };

  const disabledJoin = row.state === 'end' || row.creator._id === user._id;

  return (
    <Stack
      sx={{
        px: 1,
        py: 0.5,
        gap: 0.5,
        borderRadius: 0.5,
        flexDirection: "row",
        position: 'relative',
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.04)",
        ...(row.state === 'end' && {
          bgcolor: `rgba(0, 0, 0, 0.15)`,
        })
      }}
    >
      <Stack
        width={0.9}
        position="relative"
      >
        <Typography fontSize={14} textAlign="center" mt={-2} lineHeight={2.2}>${row.amount}</Typography>
        <Stack direction="row" alignItems="center" gap={1.5} >
          <Stack
            direction="row-reverse"
            width={0.5}
            alignItems="center"
          >
            <Badge
              badgeContent={
                <Box
                  component="img"
                  alt=""
                  src={row.side === true ? TCoin : HCoin}
                  style={{
                    width: row.result === "creator" ? 25 : 20,
                    height: row.result === "creator" ? 25 : 20,
                    opacity: (!row.result || row.result === "creator") ? 1 : 0.8,
                  }}
                />
              }
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{
                mt: -1
              }}
            >
              <Avatar
                alt={row.creator.first_name}
                src={row.creator.avatar}
                sx={{
                  width: 40, height: 40, borderRadius: 0.6,
                  border: `2px solid #FFB802`,
                  ...(row.state === "end" && {
                    border: `2px solid ${row.result === "creator" ? "#78ff0d" : "grey"}`
                  })
                }}
              />
            </Badge>
            <TextMaxLine line={1} color="warning.main" mr={1} width={80}
              textAlign="right" fontSize={14} >
              {`${row.creator.first_name} ${row.creator.last_name}`}
            </TextMaxLine>
          </Stack>

          <Stack sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12 }}>vs</Typography>
          </Stack>

          <Stack
            direction="row"
            width={0.5}
            alignItems="center"
          >
            <Badge
              className="m_badge"
              badgeContent={
                <Box
                  component="img"
                  alt=""
                  src={row.side === true ? HCoin : TCoin}
                  style={{
                    width: row.result === "joiner" ? 25 : 20,
                    height: row.result === "joiner" ? 25 : 20,
                    opacity: (!row.result || row.result === "joiner") ? 1 : 0.8,
                  }}
                />
              }
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{
                mt: -1
              }}
            >
              <Tooltip title={!row.joiner ? "Join" : undefined} arrow >
                <IconButton sx={{ p: 0 }} >
                  <Avatar
                    alt={row.joiner?.first_name}
                    src={!row.joiner?.avatar ? unknownImg : row.joiner.avatar}
                    sx={{
                      width: 40, height: 40, borderRadius: `5px`,
                      border: `2px solid #FFB802`,
                      ...(row.state === "end" && {
                        border: `2px solid ${row.result === "joiner" ? "#78ff0d" : "grey"}`
                      })
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Badge>

            <TextMaxLine line={1} ml={1} fontSize={14} width={80}  >
              {!row.joiner?.first_name ? 'Waiting...' : `${row.joiner?.first_name} ${row.joiner?.last_name}`}
            </TextMaxLine>
          </Stack>
        </Stack>
      </Stack>

      <Divider orientation='vertical' sx={{
        height: 60,
      }} />

      <Stack sx={{ gap: 0.1 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={disabledJoin}
          sx={{
            borderRadius: 0.2,
            minWidth: 40,
            height: 40, width: 40,
            bgcolor: "background.paper"
          }}
          onClick={joinRoom}
        >
          <Iconify icon="icon-park-twotone:people-left" color={!disabledJoin ? "primary.main" : "grey"} />
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 0.2,
            minWidth: 40,
            height: 40, width: 40,
            bgcolor: "background.paper"
          }}
          onClick={ViewGame}
        >
          <Iconify icon='famicons:eye-outline' color="info.main" />
        </Button>
      </Stack>
    </Stack>
  );
}
