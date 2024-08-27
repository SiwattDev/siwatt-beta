import {
    EnergySavingsLeafRounded,
    MapRounded,
    MonetizationOnRounded,
    SavingsRounded,
    SolarPowerRounded,
} from '@mui/icons-material'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import {
    BudgetResult,
    BudgetWithClientData,
} from '../../../../../types/BudgetTypes'

export default function Investment({
    result,
    budget,
}: {
    result: BudgetResult
    budget: BudgetWithClientData
}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='h6'>Investimento:</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card elevation={3}>
                    <CardContent className='text-center py-3'>
                        <Typography className='fw-bold'>
                            <MonetizationOnRounded /> Valor do Investimento:
                        </Typography>
                        <Typography>
                            {result.plantValue.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card elevation={3}>
                    <CardContent className='text-center py-3'>
                        <Typography className='fw-bold'>
                            <SolarPowerRounded />
                            {'  '}
                            Quantidade de Placas
                        </Typography>
                        <Typography>
                            {budget.kit.modules.amount ||
                                budget.kit.modules.quantity}{' '}
                            unidades
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card elevation={3}>
                    <CardContent className='text-center py-3'>
                        <Typography className='fw-bold'>
                            <MapRounded />
                            {'  '}
                            Tamanho da Usina (m²)
                        </Typography>
                        <Typography>{result.areaNeeded} m²</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card elevation={3}>
                    <CardContent className='text-center py-3'>
                        <Typography className='fw-bold'>
                            <MonetizationOnRounded />
                            {'  '}
                            Tamanho da Usina (KWp)
                        </Typography>
                        <Typography>
                            {result.peakGeneration.toFixed(2)} KWp
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant='h6'>Geração em KW</Typography>
                <Card elevation={3}>
                    <CardContent className='text-center py-3 d-flex align-items-center justify-content-center gap-3'>
                        <EnergySavingsLeafRounded />
                        <Box>
                            <Typography>
                                <strong>Geração de KWh/mês:</strong>{' '}
                                {result.averageEnergyGeneration.toFixed(0)}
                            </Typography>
                            <Typography>
                                <strong>Geração de KWh/ano:</strong>{' '}
                                {parseFloat(
                                    result.averageEnergyGeneration.toFixed(0)
                                ) * 12}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant='h6'>Economia em R$</Typography>
                <Card elevation={3}>
                    <CardContent className='text-center py-3 d-flex align-items-center justify-content-center gap-3'>
                        <SavingsRounded />
                        <Box>
                            <Typography>
                                <strong>Economia mensal:</strong>{' '}
                                {result.investmentReturnPayback.monthlySavings.toLocaleString(
                                    'pt-BR',
                                    {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }
                                )}
                            </Typography>
                            <Typography>
                                <strong>Economia anual:</strong>{' '}
                                {(
                                    result.investmentReturnPayback
                                        .monthlySavings * 12
                                ).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
