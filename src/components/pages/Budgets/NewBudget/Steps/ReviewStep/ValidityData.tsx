import { Box, Typography } from '@mui/material'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { useContext } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'

export default function ValidityData() {
    const { budget } = useContext(BudgetContext)

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Validade:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                    <StaticDatePicker
                        displayStaticWrapperAs='desktop'
                        value={dayjs(budget.validity)}
                        readOnly={true}
                        sx={{
                            borderRadius: '10px',
                        }}
                    />
                </Box>
            </LocalizationProvider>
        </React.Fragment>
    )
}
