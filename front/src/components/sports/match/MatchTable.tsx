import { Box, Stack, Typography } from '@mui/material';
import { GroupTableRow } from './types';

interface MatchTableProps {
  groupTable: GroupTableRow[];
  groupName?: string;
}

export default function MatchTable({ groupTable, groupName }: MatchTableProps) {
  return (
    <Box sx={{ py: 3 }}>
      {/* Group Title with Lines */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1, height: 1, bgcolor: '#3A3D4A' }} />
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {groupName || 'Group Table'}
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: '#3A3D4A' }} />
      </Box>

      {groupTable.length > 0 ? (
        /* Table */
        <Box sx={{ overflow: 'hidden', maxWidth: '600px', mx: 'auto' }}>
          {/* Table Header */}
          <Box
            sx={{
              display: 'flex',
              borderBottom: '1px solid #3A3D4A',
              py: 1.5,
              px: 2,
            }}
          >
            <Box sx={{ width: 40, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 600, textTransform: 'uppercase' }}
              >
                N°
              </Typography>
            </Box>
            <Box sx={{ flex: 1, pl: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 600, textTransform: 'uppercase' }}
              >
                {groupName}
              </Typography>
            </Box>
            <Box sx={{ width: 40, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 600, textTransform: 'uppercase' }}
              >
                P
              </Typography>
            </Box>
            <Box sx={{ width: 40, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 600, textTransform: 'uppercase' }}
              >
                ±
              </Typography>
            </Box>
            <Box sx={{ width: 40, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontWeight: 600, textTransform: 'uppercase' }}
              >
                PTS
              </Typography>
            </Box>
          </Box>

          {/* Table Rows */}
          {groupTable.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: index < groupTable.length - 1 ? '1px solid #3A3D4A' : 'none',
                py: 1.5,
                px: 2,
                bgcolor: 'transparent',
              }}
            >
              {/* Position */}
              <Box sx={{ width: 40, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontWeight: index === 0 ? 700 : 400 }}
                >
                  {row.position}
                </Typography>
              </Box>

              {/* Team */}
              <Box sx={{ flex: 1, pl: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: index === 0 ? '#00FF00' : '#FF0000',
                      borderRadius: '50%',
                    }}
                  />
                  <Box
                    component="img"
                    src={row.crest}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '1px solid #3A3D4A',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'white', ml: 1 }}>
                    {row.team}
                  </Typography>
                </Stack>
              </Box>

              {/* Played */}
              <Box sx={{ width: 40, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontWeight: index === 0 ? 700 : 400 }}
                >
                  {row.played}
                </Typography>
              </Box>

              {/* Goal Difference */}
              <Box sx={{ width: 40, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontWeight: index === 0 ? 700 : 400 }}
                >
                  {row.goalDiff}
                </Typography>
              </Box>

              {/* Points */}
              <Box sx={{ width: 40, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontWeight: index === 0 ? 700 : 400 }}
                >
                  {row.points}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#A0A3A7' }}>
            No group table data available.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

