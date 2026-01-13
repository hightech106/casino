import isEqual from 'lodash/isEqual';
import { useCallback, useState } from 'react';
// @mui
import {
    Card,
    Typography,
    CardHeader,
    CardContent,
    Stack,
    Divider,
    CircularProgress,
    TableContainer,
    Table,
    TableBody,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import {
    emptyRows,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableNoData,
    TablePaginationCustom,
    useTable
} from 'src/components/table';
import { useLocales } from 'src/locales';

import type { ITxTableFilters, TransactionsProps } from 'src/types';
import HistoryTableToolbar from './tx-table/history-table-toolbar';
import HistoryTableFiltersResult from './tx-table/history-table-filters-result';
import HistoryTableRow from './tx-table/history-table-row';
import MobileTransactionCard from './tx-table/mobile-transaction-card';

// ----------------------------------------------------------------------

const defaultFilters: ITxTableFilters = {
    paymentId: '',
    coin: [],
    status: 'all',
};

type Props = {
    loading: boolean;
    transactions: TransactionsProps[],
}
export default function Transactions({ loading, transactions }: Props) {
    const table = useTable();
    const { t } = useLocales();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const TABLE_HEAD = [
        { id: 'paymentId', label: t("id"), width: 100, },
        { id: 'symbol', label: t("symbol"), width: 100 },
        { id: 'ipn_type', label: t("type"), width: 50 },
        { id: 'amount', label: t("amount"), width: 100 },
        { id: 'fiat_amount', label: t("fiat_amount"), width: 100 },
        { id: 'actually_paid', label: t("actually_paid"), width: 100 },
        { id: 'status_text', label: t("status"), width: 100 },
        { id: 'updatedAt', label: t("time"), width: 100 },
        { id: 'address', label: t("address"), width: 100 },
    ];

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: transactions,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleFilters = useCallback(
        (name: string, value: string | string[]) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    return (
        <Card sx={{ 
            bgcolor: '#2B2F3D',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, #24ee89 0%, transparent 100%)',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            },
        }}>
            <CardHeader
                sx={{ py: 2 }}
                title={
                    <Stack direction="row" gap={2} alignItems="center">
                        <Typography 
                            variant="h5"
                            sx={{
                                fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif !important',
                                fontWeight: '400 !important',
                                fontStyle: 'italic !important',
                                textTransform: 'uppercase !important',
                                transform: 'skewX(-5deg)',
                                '& span:first-of-type': {
                                    color: '#24ee89 !important'
                                },
                                '& span:last-of-type': {
                                    color: '#FFFFFF !important'
                                }
                            }}
                        >
                            <span>Transaction</span> <span>History</span>
                        </Typography>
                        {loading &&
                            <CircularProgress size={24} />
                        }
                    </Stack>
                }
            />
            <Divider sx={{ borderColor: 'rgba(189, 200, 240, 0.12)' }} />
            <CardContent>

                <HistoryTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                    coinOptions={transactions.reduce((ary: string[], row) => {
                        if (!ary.includes(row.symbol))
                            ary = [...ary, row.symbol];
                        return ary;
                    }, [])}
                />

                {canReset && (
                    <HistoryTableFiltersResult
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        onResetFilters={handleResetFilters}
                        //
                        results={dataFiltered.length}
                        sx={{ p: 2.5, pt: 0 }}
                    />
                )}

                {isMobile ? (
                    // Mobile Card View
                    <Box sx={{ mt: 2 }}>
                        {dataFiltered
                            .slice(
                                table.page * table.rowsPerPage,
                                table.page * table.rowsPerPage + table.rowsPerPage
                            )
                            .map((row) => (
                                <MobileTransactionCard
                                    key={row._id}
                                    row={row}
                                />
                            ))}
                        
                        {notFound && (
                            <Box 
                                sx={{ 
                                    textAlign: 'center', 
                                    py: 4,
                                    color: 'text.secondary'
                                }}
                            >
                                <Typography>No transactions found</Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    // Desktop Table View
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={transactions.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            transactions.map((row) => row._id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row, index) => (
                                            <HistoryTableRow
                                                key={row._id}
                                                row={row}
                                                headLabel={TABLE_HEAD}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, transactions.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                )}

                <TablePaginationCustom
                    labelRowsPerPage={`${t("rows_per_page")}:`}
                    count={dataFiltered.length}
                    page={table.page}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    //
                    dense={table.dense}
                    onChangeDense={table.onChangeDense}
                />
            </CardContent>
        </Card>
    );
}



function applyFilter({
    inputData,
    comparator,
    filters,
}: {
    inputData: TransactionsProps[];
    comparator: (a: any, b: any) => number;
    filters: ITxTableFilters;
}) {
    const { paymentId, status, coin } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (paymentId) {
        inputData = inputData.filter(
            (e) => e.paymentId.toLowerCase().indexOf(paymentId.toLowerCase()) !== -1
        );
    }

    if (coin.length) {
        inputData = inputData.filter((e) => coin.includes(e.symbol));
    }

    return inputData;
}