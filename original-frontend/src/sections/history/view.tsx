import { useEffect, useState } from 'react';
import moment from 'moment';
// @mui
import {
  Container,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Typography
} from '@mui/material';
// components
import { useSettingsContext } from 'src/components/settings';
import { useTable, TablePaginationCustom } from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import useApi from 'src/hooks/use-api';
import { IHistory } from './history.type';

// ----------------------------------------------------------------------

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => any;
}

const COLUMNS: Column[] = [
  { id: 'bet', label: 'Bet', minWidth: 30 },
  {
    id: 'target',
    label: 'Target', minWidth: 30,
    format: (value) => `x${value}`,
  },
  {
    id: 'payout',
    label: 'Result', minWidth: 50,
    format: (value) => (
      <Typography sx={{ color: value > 0 ? "#31ff00" : "#ff8400" }} >
        {value.toFixed(2)}
      </Typography>
    ),
  },
  {
    id: 'type',
    label: 'Game',
    minWidth: 100,
  },
  {
    id: 'createdAt',
    label: 'Date',
    minWidth: 100,
    format: (value) => moment(value).startOf('s').fromNow(),
  },
];

export default function HistoryView() {
  const settings = useSettingsContext();
  const { getUserHisotryApi } = useApi();
  const table = useTable({ defaultRowsPerPage: 10 });
  const [list, setList] = useState<IHistory[]>([]);


  const getData = async () => {
    const res = await getUserHisotryApi();
    if (!res?.data) return;
    setList(res.data);
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'sm'}>
      <TableContainer sx={{ overflow: 'unset', mt: 3 }}>
        <Scrollbar sx={{ maxHeight: "76vh" }}>
          <Table stickyHeader sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {list.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              ).map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {COLUMNS.map((column) => {
                    // @ts-ignore
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={list.length}
        page={table.page}
        labelRowsPerPage="Rows"
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Container>
  );
}
