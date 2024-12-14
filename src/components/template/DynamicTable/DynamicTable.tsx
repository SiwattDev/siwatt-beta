import { SaveRounded } from '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    useTheme,
} from '@mui/material'
import { styled } from '@mui/system'
import React, { useContext, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'

type DynamicTableProps = {
    tableID: string
    data: any[]
    defaultVisibleFields: string[]
    fieldLabels: { [key: string]: string }
    filterText?: string
    customColumns?: CustomColumn[]
}

type CustomColumn = {
    title: string
    render: (row: any) => React.ReactNode
}

type Order = 'asc' | 'desc'

const StyledTableCell = styled(TableCell)(() => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}))

const DynamicTable: React.FC<DynamicTableProps> = ({
    tableID,
    data,
    defaultVisibleFields,
    fieldLabels,
    filterText = '',
    customColumns = [],
}) => {
    const theme = useTheme()
    const { showAlert } = useContext(AlertContext)

    const [visibleFields, setVisibleFields] = useState<string[]>(() => {
        const savedFields = localStorage.getItem(`visibleFields_${tableID}`)
        return savedFields ? JSON.parse(savedFields) : defaultVisibleFields
    })

    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const [rowsPerPage, setRowsPerPage] = useState<number>(5)

    const getNestedProperty = (obj: any, path: string) => {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null
        }, obj)
    }

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortData = (array: any[], comparator: (a: any, b: any) => number) => {
        const stabilizedThis = array.map(
            (el, index) => [el, index] as [any, number]
        )
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) return order
            return a[1] - b[1]
        })
        return stabilizedThis.map((el) => el[0])
    }

    const getComparator = (order: Order, orderBy: string) => {
        return order === 'desc'
            ? (a: any, b: any) => descendingComparator(a, b, orderBy)
            : (a: any, b: any) => -descendingComparator(a, b, orderBy)
    }

    const descendingComparator = (a: any, b: any, orderBy: string) => {
        const aValue = getNestedProperty(a, orderBy)
        const bValue = getNestedProperty(b, orderBy)

        const isDate = (value: string) => {
            return /^\d{2}\/\d{2}\/\d{4}$/.test(value)
        }

        const parseDate = (value: string) => {
            const [day, month, year] = value.split('/').map(Number)
            return new Date(year, month - 1, day)
        }

        let aComparable = aValue
        let bComparable = bValue

        if (typeof aValue === 'string' && isDate(aValue))
            aComparable = parseDate(aValue).getTime()

        if (typeof bValue === 'string' && isDate(bValue))
            bComparable = parseDate(bValue).getTime()

        if (bComparable < aComparable) return -1
        if (bComparable > aComparable) return 1
        return 0
    }

    const handleFieldToggle = (field: string) => {
        setVisibleFields((prevFields) => {
            const newFields = prevFields.includes(field)
                ? prevFields.filter((f) => f !== field)
                : [...prevFields, field]
            return newFields
        })
    }

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const filterData = (data: any[], filterText: string) => {
        if (!filterText) return data
        return data.filter((row) =>
            visibleFields.some((field) => {
                const value = getNestedProperty(row, field)
                return value
                    ?.toString()
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
            })
        )
    }

    const sortedData = sortData(
        filterData(data, filterText),
        getComparator(order, orderBy)
    )

    const highlightText = (text: string, highlight: string) => {
        if (!highlight) return text
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
        return (
            <span>
                {parts.map((part, index) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span
                            key={index}
                            style={{
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                            }}
                        >
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </span>
        )
    }

    const renderCellContent = (value: any) => {
        const displayValue = Array.isArray(value)
            ? value.length
            : value || 'N/A'
        return displayValue.length > 30 ? (
            <Tooltip title={displayValue}>
                <span>
                    {highlightText(displayValue.substring(0, 30), filterText)}
                    ...
                </span>
            </Tooltip>
        ) : (
            highlightText(displayValue, filterText)
        )
    }

    const saveVisibleFields = () => {
        localStorage.setItem(
            `visibleFields_${tableID}`,
            JSON.stringify(visibleFields)
        )
        showAlert({
            message: 'Configuração salva com sucesso!',
            type: 'success',
        })
    }

    return (
        <Paper>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Mostrar/Ocultar campos
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={0}>
                        {Object.keys(fieldLabels).map((field) => (
                            <Grid item xs={6} key={field}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={visibleFields.includes(
                                                field
                                            )}
                                            onChange={() =>
                                                handleFieldToggle(field)
                                            }
                                            name={field}
                                        />
                                    }
                                    label={fieldLabels[field]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        variant='contained'
                        size='small'
                        startIcon={<SaveRounded />}
                        className='mt-2'
                        onClick={saveVisibleFields}
                    >
                        Salvar visualização
                    </Button>
                </AccordionDetails>
            </Accordion>
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            {visibleFields.map((field) => (
                                <StyledTableCell key={field}>
                                    <TableSortLabel
                                        active={orderBy === field}
                                        direction={
                                            orderBy === field ? order : 'asc'
                                        }
                                        onClick={() => handleRequestSort(field)}
                                    >
                                        {fieldLabels[field]}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                            {customColumns.map((column, index) => (
                                <StyledTableCell key={`custom-${index}`}>
                                    {column.title}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => (
                                <TableRow key={index}>
                                    {visibleFields.map((field) => (
                                        <StyledTableCell key={field}>
                                            {renderCellContent(
                                                getNestedProperty(row, field)
                                            )}
                                        </StyledTableCell>
                                    ))}
                                    {customColumns.map((column, i) => (
                                        <StyledTableCell
                                            key={`custom-content-${i}`}
                                        >
                                            {column.render(row)}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component='div'
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    '& p': {
                        marginTop: 'auto',
                        marginBottom: 'auto',
                    },
                }}
            />
        </Paper>
    )
}

export default DynamicTable
