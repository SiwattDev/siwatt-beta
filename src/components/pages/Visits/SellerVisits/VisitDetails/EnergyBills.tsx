import { DocumentScannerRounded } from '@mui/icons-material'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { Visit } from '../../../../../types/VisitTypes'
import StyledImage from './StyledImage'

export default function EnergyBills({ visit }: { visit: Visit }) {
    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>
                    <DocumentScannerRounded
                        sx={{ verticalAlign: 'text-top', mr: 1 }}
                    />
                    Contas de Energia
                </Typography>
                <Box className='d-flex flex-column gap-4'>
                    {visit.energyBills ? (
                        visit.energyBills.map((bill, index) => (
                            <React.Fragment key={index}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12} md={6}>
                                                <Typography
                                                    variant='h6'
                                                    className='text-center'
                                                >
                                                    Foto da Conta de Energia:
                                                </Typography>
                                                <StyledImage
                                                    src={bill.energyBill}
                                                    alt='imagem da conta de energia'
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography
                                                    variant='h6'
                                                    className='text-center'
                                                >
                                                    Foto do Gráfico de Consumo:
                                                </Typography>
                                                <StyledImage
                                                    src={bill.energyBillGraph}
                                                    alt='imagem do gráfico de consumo'
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </React.Fragment>
                        ))
                    ) : (
                        <Typography>
                            Contas de Energia ainda não foram enviadas
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}
