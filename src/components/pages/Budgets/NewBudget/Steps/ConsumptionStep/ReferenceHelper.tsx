import { Grid, Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import useUtils from '../../../../../../hooks/useUtils'

export default function ReferenceHelper() {
    const { budget } = useContext(BudgetContext)
    const { showAlert } = useContext(AlertContext)
    const { calculateAverageEnergyBill, getNeededPower, getSolarIrradiation } =
        useUtils()
    const [averageBill, setAverageBill] = useState<number | null>(null)
    const [neededPower, setNeededPower] = useState<number | null>(null)
    const [plantSize, setPlantSize] = useState<number | null>(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const averageConsumption = calculateAverageEnergyBill(
                    budget.consumption
                )
                setAverageBill(averageConsumption)

                const solarIrradiation = await getSolarIrradiation()
                const averageSolarIrradiation =
                    solarIrradiation.reduce((prev, curr) => prev + curr, 0) /
                    solarIrradiation.length
                const needed = getNeededPower({
                    averageConsumption: averageConsumption,
                    networkType: budget.consumption.networkType,
                    solarIrradiation: averageSolarIrradiation,
                })
                setNeededPower(parseFloat(needed.toFixed(2)))

                const plantSizePower =
                    (budget.kit.modules.power *
                        (budget.kit.modules.quantity || 1)) /
                    1000
                setPlantSize(parseFloat(plantSizePower.toFixed(2)))
            } catch (error) {
                console.error(error)
                showAlert({
                    message: 'Erro ao calcular dados de referência',
                    type: 'error',
                })
            }
        }

        getData()
    }, [budget.consumption, calculateAverageEnergyBill, showAlert])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
                    <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                        <strong>Consumo médio:</strong>{' '}
                        {averageBill !== null ? `${averageBill} KW` : 'N/A'}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
                    <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                        <strong>Potência necessária:</strong>{' '}
                        {neededPower !== null ? `${neededPower} KWp` : 'N/A'}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
                    <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                        <strong>Tamanho da usina:</strong>{' '}
                        {plantSize !== null ? `${plantSize} KWh/mês` : 'N/A'}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
                    <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                        <strong>Preço sugerido:</strong> N/A
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
