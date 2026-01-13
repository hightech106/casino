import { formatDistanceToNow } from 'date-fns';
// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// types
import type { ICasinoHistory } from 'src/types';
// components
import Label from 'src/components/label';
// ----------------------------------------------------------------------

type Props = {
  index: number;
  row: ICasinoHistory;
};

export default function HistoryTableRow({
  row,
  index
}: Props) {
  const { game, provider_code, user_balance, bet_money, provider, currency, win_money, refund_money, createdAt, game_type, txn_type } = row;

  return (
    <>
      <TableRow 
        hover 
        sx={{
          '&:hover': {
            bgcolor: 'rgba(138, 43, 226, 0.05)',
            '& .MuiTableCell-root': {
              borderColor: 'rgba(138, 43, 226, 0.2)'
            }
          },
          transition: 'all 0.2s ease'
        }}
      >
        <TableCell sx={{ 
          whiteSpace: 'nowrap',
          color: '#24ee89',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          {index}
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <Avatar 
            alt={game.name} 
            src={game.icon} 
            sx={{ 
              mr: 2,
              width: 40,
              height: 40,
              border: '2px solid #24ee89',
              boxShadow: '0 2px 8px rgba(138, 43, 226, 0.3)'
            }} 
          />
          <ListItemText
            primary={game.name}
            primaryTypographyProps={{ 
              typography: 'body2',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px'
            }}
          />
        </TableCell>

        <TableCell sx={{ 
          whiteSpace: 'nowrap',
          color: '#FFFFFF',
          fontWeight: 500,
          fontSize: '13px'
        }}>
          {provider.name}
        </TableCell>

        <TableCell sx={{ 
          whiteSpace: 'nowrap', 
          textTransform: "uppercase",
          color: '#24ee89',
          fontWeight: 600,
          fontSize: '12px',
          letterSpacing: '0.5px'
        }}>
          {game_type || txn_type}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Avatar 
            alt="currency" 
            src={currency} 
            sx={{ 
              width: 32, 
              height: 32,
              border: '1px solid #3A3F50'
            }} 
          />
        </TableCell>

        <TableCell sx={{ 
          whiteSpace: 'nowrap',
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          {user_balance}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="filled"
            sx={{
              bgcolor: (() => {
                if (txn_type === "BET") return '#FF4444';
                if (txn_type === "WIN") return '#4CAF50';
                return '#FF9800';
              })(),
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: '6px',
              px: 1.5,
              py: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {(() => {
              if (txn_type === "BET") return bet_money.toString();
              if (txn_type === "WIN") return win_money.toString();
              if (txn_type === "REFUND") return refund_money.toString();
              return '';
            })()}
          </Label>
        </TableCell>

        <TableCell sx={{ 
          whiteSpace: 'nowrap',
          color: '#FFFFFF',
          opacity: 0.7,
          fontSize: '12px',
          fontWeight: 500
        }}>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </TableCell>
      </TableRow>
    </>
  );
}
