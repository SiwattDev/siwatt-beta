import { Card, CardContent, Typography, useTheme } from '@mui/material'
import React from 'react'
import { BudgetResult } from '../../../../../types/BudgetTypes'
import ResponsiveBarChart from '../../../../template/ResponsiveBarChart/ResponsiveBarChart'

export default function Payback({ result }: { result: BudgetResult }) {
    const theme = useTheme()

    return (
        <React.Fragment>
            <Typography variant='h6'>Payback:</Typography>
            <Card elevation={3} className='mb-3'>
                <CardContent>
                    <Typography variant='h6' className='fw-bold text-center'>
                        {result.investmentReturnPayback.paybackInYears} anos e{' '}
                        {result.investmentReturnPayback.remainingMonths} meses
                    </Typography>
                </CardContent>
            </Card>
            <ResponsiveBarChart
                data={{
                    labels: Array.from(
                        { length: 25 },
                        (_, i) => `${i + 1} anos`
                    ),
                    datasets: [
                        {
                            label: 'Retorno Financeiro',
                            data: result.investmentReturnPayback.returnIn25Years.map(
                                (value) => parseFloat(value.toFixed(2))
                            ),
                            backgroundColor: theme.palette.secondary.main,
                            borderWidth: 0,
                        },
                    ],
                }}
                options={{ plugins: { title: { display: true } } }}
                title='Payback em 25 anos'
            />
        </React.Fragment>
    )
}
