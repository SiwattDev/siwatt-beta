import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { BudgetResult } from '../../../../../types/BudgetTypes'

interface PaymentPlanProps {
    installments: number[]
    startIndex: number
    result: BudgetResult
}

function PaymentPlan({ installments, startIndex, result }: PaymentPlanProps) {
    return (
        <Box className='w-100'>
            {installments.map((amount, index) => (
                <Typography key={index}>
                    <strong>{amount}x:</strong>{' '}
                    {result.bankFinancingInstallments[
                        startIndex + index
                    ].toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </Typography>
            ))}
        </Box>
    )
}

interface PaymentMethodsProps {
    result: BudgetResult
}

export default function PaymentMethods({ result }: PaymentMethodsProps) {
    const creditCardInstallments = [2, 4, 8, 10, 12]

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='h6'>
                    Formas e Condições de Pagamento
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card elevation={3} sx={{ height: '100%' }}>
                    <CardContent
                        className='d-flex flex-column justify-content-center align-items-center'
                        sx={{ height: '100%' }}
                    >
                        <Typography variant='h5' className='fw-bold mb-2'>
                            A vista
                        </Typography>
                        <Typography variant='h6'>
                            {result.plantValue.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={9}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant='h6' className='fw-bold'>
                            Financiamento bancário
                        </Typography>
                        <Typography>
                            <strong>Financiamento de:</strong>{' '}
                            {result.plantValue.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <PaymentPlan
                                    installments={[24, 36, 48]}
                                    startIndex={0}
                                    result={result}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <PaymentPlan
                                    installments={[60, 90, 120]}
                                    startIndex={3}
                                    result={result}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant='h6' className='fw-bold'>
                            Cartão de crédito
                        </Typography>
                        <Grid
                            container
                            spacing={2}
                            sx={{ display: { md: 'flex' } }}
                        >
                            {creditCardInstallments.map((amount, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={index >= 3 ? 6 : 4}
                                    md={2.4}
                                    key={index}
                                    sx={{ flex: { md: '1 1 auto' } }}
                                >
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Typography>
                                                <strong>{amount}x:</strong>
                                            </Typography>
                                            <Typography>
                                                {result.creditCardInstallments[
                                                    index
                                                ].toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
