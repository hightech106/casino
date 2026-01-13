import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// hooks
import useApi from 'src/hooks/use-api';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';
import { useLocales } from 'src/locales';
// types
import type { ICasinoHistory, ICasinoTableFilters, ICasinoTableFilterValue } from 'src/types';
//
import HistoryTableRow from './casino-table/history-table-row';
import HistoryTableToolbar from './casino-table/history-table-toolbar';
import HistoryTableFiltersResult from './casino-table/history-table-filters-result';
//

// ----------------------------------------------------------------------

const defaultFilters: ICasinoTableFilters = {
    name: '',
    category: [],
    status: 'all',
};

// ----------------------------------------------------------------------

export default function MyBetsCasinoView() {
    const table = useTable();
    const { t } = useLocales();

    const STATUS_OPTIONS = [{ value: 'all', label: t("all") }, { value: 'win', label: t("win") }, { value: 'lose', label: t("lose") },];

    const TABLE_HEAD = [
        { id: 'no', label: 'No', width: 50, },
        { id: 'game.name', label: t("game") },
        { id: 'provider_code', label: t("category"), width: 180 },
        { id: 'game_type', label: t("type"), width: 100 },
        { id: 'currency', label: t('currency'), width: 100 },
        { id: 'user_balance', label: t("before"), width: 100 },
        { id: 'bet_balance', label: t('amount'), width: 100 },
        // { id: 'win_balance', label: 'Win', width: 100 },
        { id: 'createdAt', label: t('time'), width: 150 },
    ];
    const { get_casino_history } = useApi()

    const settings = useSettingsContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<ICasinoHistory[]>([]);

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;


    const handleFilters = useCallback(
        (name: string, value: ICasinoTableFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const handleFilterStatus = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const getList = async () => {
        setLoading(true);
        const res = await get_casino_history();
        setLoading(false);
        if (!res?.data) return;
        setTableData(res?.data);
    }

    useEffect(() => {
        getList();
        // eslint-disable-next-line
    }, []);

    let categories = {}

    tableData.forEach(element => {
        categories = { ...categories, [element.provider.name]: 1 }
    });

    return (
        <Container maxWidth={false} sx={{ bgcolor: '#232626', minHeight: '100vh', py: 3 }}>
            <CustomBreadcrumbs
                heading={t("casino")}
                links={[
                    {
                        name: t("my_bets"),
                    },
                    {
                        name: t("casino"),
                    },
                ]}
                sx={{
                    mb: 3,
                    '& .MuiBreadcrumbs-ol': {
                        color: '#FFFFFF'
                    },
                    '& .MuiTypography-root': {
                        color: '#24ee89',
                        fontWeight: 600
                    }
                }}
            />

            <Card sx={{ 
                bgcolor: '#2B2F3D',
                borderRadius: '12px',
                border: '1px solid #3A3F50',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
            }}>
                <Tabs
                    value={filters.status}
                    onChange={handleFilterStatus}
                    sx={{
                        px: 3,
                        py: 2,
                        borderBottom: '1px solid #3A3F50',
                        '& .MuiTab-root': {
                            color: '#FFFFFF',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '13px',
                            '&.Mui-selected': {
                                color: '#24ee89'
                            },
                            '&:hover': {
                                color: '#24ee89',
                                opacity: 0.8
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#24ee89',
                            height: '3px',
                            borderRadius: '2px'
                        }
                    }}
                >
                    {STATUS_OPTIONS.map((tab) => (
                        <Tab
                            key={tab.value}
                            iconPosition="end"
                            value={tab.value}
                            label={tab.label}
                            icon={
                                <Label
                                    variant="filled"
                                    sx={{
                                        bgcolor: tab.value === filters.status ? '#24ee89' : 'rgba(138, 43, 226, 0.2)',
                                        color: tab.value === filters.status ? '#000' : '#24ee89',
                                        fontWeight: 700,
                                        fontSize: '11px',
                                        borderRadius: '6px',
                                        minWidth: '24px',
                                        height: '20px'
                                    }}
                                >
                                    {tab.value === 'all' && tableData.length}
                                    {tab.value === 'win' &&
                                        tableData.filter((e) => e.win_money > 0).length}
                                    {tab.value === 'lose' &&
                                        tableData.filter((e) => e.win_money === 0).length}
                                </Label>
                            }
                        />
                    ))}
                </Tabs>

                <HistoryTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                    //
                    categoryOptions={Object.keys(categories)}
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

                <TableContainer sx={{ 
                    position: 'relative', 
                    overflow: 'unset',
                    bgcolor: '#232626',
                    borderRadius: '0 0 12px 12px'
                }}>
                    <Scrollbar>
                        <Table 
                            size={table.dense ? 'small' : 'medium'} 
                            sx={{ 
                                minWidth: 960,
                                '& .MuiTableCell-root': {
                                    borderBottom: '1px solid #3A3F50',
                                    color: '#FFFFFF'
                                },
                                '& .MuiTableHead-root .MuiTableCell-root': {
                                    bgcolor: '#2B2F3D',
                                    color: '#24ee89',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                },
                                '& .MuiTableRow-root:hover': {
                                    bgcolor: 'rgba(138, 43, 226, 0.05)'
                                }
                            }}
                        >
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={tableData.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        tableData.map((row) => row._id)
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
                                            index={index + 1}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={denseHeight}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                />

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePaginationCustom
                    labelRowsPerPage={`${t("rows_per_page")}:`}
                    count={dataFiltered.length}
                    page={table.page}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    dense={table.dense}
                    onChangeDense={table.onChangeDense}
                    sx={{
                        bgcolor: '#2B2F3D',
                        borderTop: '1px solid #3A3F50',
                        color: '#FFFFFF',
                        '& .MuiTablePagination-toolbar': {
                            color: '#FFFFFF'
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            color: '#FFFFFF',
                            fontWeight: 500
                        },
                        '& .MuiSelect-select': {
                            color: '#24ee89',
                            fontWeight: 600
                        },
                        '& .MuiIconButton-root': {
                            color: '#24ee89',
                            '&:hover': {
                                bgcolor: 'rgba(138, 43, 226, 0.1)'
                            },
                            '&.Mui-disabled': {
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                        }
                    }}
                />
            </Card>
        </Container>
    );
}


// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filters,
}: {
    inputData: ICasinoHistory[];
    comparator: (a: any, b: any) => number;
    filters: ICasinoTableFilters;
}) {
    const { name, status, category } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (e) => e.game && e.game.name && e.game.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (status === 'win') {
        inputData = inputData.filter((e) => e.win_money > 0);
    }

    if (status === 'lose') {
        inputData = inputData.filter((e) => e.win_money === 0);
    }

    if (category.length) {
        inputData = inputData.filter((e) => category.includes(e.provider.name));
    }

    return inputData;
}
