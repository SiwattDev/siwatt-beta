import { Box, Typography } from '@mui/material'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'

function addThreeDays(): string {
    let today = new Date()
    today.setDate(today.getDate() + 3)
    return today.toISOString().split('T')[0]
}

export default function ValidityStep() {
    const { budget, setBudget } = useContext(BudgetContext)
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDate(date)
            setBudget({ ...budget, validity: date.format('YYYY-MM-DD') })
            console.log(date.format('YYYY-MM-DD'))
        }
    }

    useEffect(() => {
        if (budget.validity) {
            setSelectedDate(dayjs(budget.validity))
        } else {
            const newValidity = dayjs(addThreeDays())
            setSelectedDate(newValidity)
            setBudget({ ...budget, validity: newValidity.format('YYYY-MM-DD') })
        }
    }, [budget.validity, setBudget])

    const shouldDisableDate = (date: Dayjs) => {
        return date.isBefore(dayjs(), 'day')
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Typography variant='h6'>Selecione a validade</Typography>
                <StaticDatePicker
                    displayStaticWrapperAs='desktop'
                    value={selectedDate}
                    onChange={handleDateChange}
                    shouldDisableDate={shouldDisableDate}
                />
            </Box>
        </LocalizationProvider>
    )
}
