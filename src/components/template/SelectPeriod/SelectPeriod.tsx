import {
    CalendarMonthRounded,
    DateRangeRounded,
    EventRepeatRounded,
    TodayRounded,
} from '@mui/icons-material'
import { Box, Button, Paper } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useRef, useState } from 'react'

interface SelectPeriodProps {
    period?: { startDate: Dayjs; endDate: Dayjs }
    onChange: (period: { startDate: string; endDate: string }) => void
}

interface DateRange {
    startDate: Dayjs | null
    endDate: Dayjs | null
}

export default function SelectPeriod({ period, onChange }: SelectPeriodProps) {
    const datePickerSmall = {
        '& input': {
            padding: '11px 14px',
        },
    }

    const lineNoWrap = {
        whiteSpace: 'nowrap',
        minWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    }

    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: period?.startDate || dayjs(new Date()),
        endDate: period?.endDate || dayjs(new Date()),
    })

    const prevDateRange = useRef<DateRange>(dateRange)

    useEffect(() => {
        if (
            dateRange.startDate &&
            dateRange.endDate &&
            (dateRange.startDate !== prevDateRange.current.startDate ||
                dateRange.endDate !== prevDateRange.current.endDate)
        ) {
            prevDateRange.current = dateRange
            onChange({
                startDate: dateRange.startDate.format('YYYY-MM-DD'),
                endDate: dateRange.endDate.format('YYYY-MM-DD'),
            })
        }
    }, [dateRange, onChange])

    useEffect(() => {
        if (period) {
            onChange({
                startDate: period.startDate.format('YYYY-MM-DD'),
                endDate: period.endDate.format('YYYY-MM-DD'),
            })
        }
    }, [])

    const setPeriod = (startDate: Dayjs, endDate: Dayjs) => {
        setDateRange({
            startDate,
            endDate,
        })
    }

    const setLast7Days = () =>
        setPeriod(dayjs(subDays(new Date(), 7)), dayjs(new Date()))
    const setLast30Days = () =>
        setPeriod(dayjs(subDays(new Date(), 30)), dayjs(new Date()))
    const setCurrentMonth = () =>
        setPeriod(dayjs(startOfMonth(new Date())), dayjs(new Date()))
    const setLastMonth = () =>
        setPeriod(
            dayjs(startOfMonth(subMonths(new Date(), 1))),
            dayjs(endOfMonth(subMonths(new Date(), 1)))
        )

    const handleDateChange =
        (dateKey: 'startDate' | 'endDate') => (date: Dayjs | null) => {
            setDateRange({
                ...dateRange,
                [dateKey]: date,
            })
        }

    return (
        <Paper className='p-3' sx={{ overflowX: 'auto' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box className='d-flex gap-3 mb-3'>
                    <DatePicker
                        label='Data de início'
                        value={dateRange.startDate}
                        onChange={handleDateChange('startDate')}
                        format='DD/MM/YYYY'
                        className='w-100'
                        sx={datePickerSmall}
                    />
                    <DatePicker
                        label='Data de fim'
                        value={dateRange.endDate}
                        onChange={handleDateChange('endDate')}
                        format='DD/MM/YYYY'
                        className='w-100'
                        sx={datePickerSmall}
                    />
                </Box>
                <Box
                    className='d-flex gap-2'
                    sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
                >
                    <Button
                        variant='contained'
                        onClick={setLast7Days}
                        sx={lineNoWrap}
                    >
                        <DateRangeRounded sx={{ mr: 1, flexShrink: 0 }} />
                        Últimos 7 dias
                    </Button>
                    <Button
                        variant='contained'
                        onClick={setLast30Days}
                        sx={lineNoWrap}
                    >
                        <CalendarMonthRounded sx={{ mr: 1, flexShrink: 0 }} />
                        Últimos 30 dias
                    </Button>
                    <Button
                        variant='contained'
                        onClick={setCurrentMonth}
                        sx={lineNoWrap}
                    >
                        <TodayRounded sx={{ mr: 1, flexShrink: 0 }} />
                        Mês atual
                    </Button>
                    <Button
                        variant='contained'
                        onClick={setLastMonth}
                        sx={lineNoWrap}
                    >
                        <EventRepeatRounded sx={{ mr: 1, flexShrink: 0 }} />
                        Mês anterior
                    </Button>
                </Box>
            </LocalizationProvider>
        </Paper>
    )
}
