import { Box, Typography } from '@mui/material'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { Budget } from '../../../../../../types/BudgetTypes'

export default function ValidityData({
    budgetData: initialBudgetData,
}: {
    budgetData?: Budget
}) {
    const { budget } = useContext(BudgetContext)
    const [budgetData, setBudgetData] = useState<Budget | undefined>(
        initialBudgetData
    )

    useEffect(() => {
        if (budget && !budgetData) setBudgetData(budget)
    }, [budget, budgetData])

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Validade:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                    {budgetData?.validity ? (
                        <StaticDatePicker
                            displayStaticWrapperAs='desktop'
                            value={dayjs(budgetData.validity)}
                            readOnly={true}
                            sx={{
                                borderRadius: '10px',
                            }}
                        />
                    ) : (
                        <Typography variant='body2' color='error'>
                            Dados do orçamento não disponíveis
                        </Typography>
                    )}
                </Box>
            </LocalizationProvider>
        </React.Fragment>
    )
}
