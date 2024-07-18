import { DoneRounded, EditRounded } from '@mui/icons-material'
import { Button, Grid, Paper, Typography, useTheme } from '@mui/material'
import React, { useContext, useState } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { Kit, Product } from '../../../../../../types/BudgetTypes'
import KitModal from './KitModal'

function KitProduct({ product }: { product: Product }) {
    return (
        <Paper className='p-3'>
            <Typography variant='subtitle1'>
                <strong>Modelo:</strong> {product.model}
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <Typography variant='body1'>
                        <strong>Quantidade:</strong> {product.quantity}
                    </Typography>
                    <Typography variant='body1'>
                        <strong>Potência:</strong> {product.power}W
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant='body1'>
                        <strong>Preço Unitário:</strong>{' '}
                        {product.unitPrice.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </Typography>
                    <Typography variant='body1'>
                        <strong>Preço Total:</strong>{' '}
                        {product.totalPrice.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default function KitItem({ kit }: { kit: Kit }) {
    const [open, setOpen] = useState<boolean>(false)
    const { budget, setBudget } = useContext(BudgetContext)
    const theme = useTheme()

    const handleSelectKit = () => {
        setBudget({ ...budget, kit })
    }

    const setKit = (kit: Kit) => {
        setBudget({ ...budget, kit })
    }

    return (
        <React.Fragment>
            <Paper
                className={`mb-3 p-3  ${
                    budget.kit?.id === kit.id
                        ? 'border border-2 border-dark-subtle shadow'
                        : 'shadow-sm'
                }`}
                sx={{
                    background: theme.palette.background.default,
                    width: '100%',
                }}
                elevation={3}
                data-bs-theme={theme.palette.mode}
            >
                <Grid container spacing={1}>
                    <Grid
                        item
                        xs={12}
                        md={9}
                        lg={10}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <KitProduct product={kit.modules} />
                        <KitProduct product={kit.inverter} />
                        <Paper className='py-2 px-3'>
                            <Typography variant='subtitle1'>
                                <strong>Total:</strong>{' '}
                                {(
                                    kit.modules.totalPrice +
                                    kit.inverter.totalPrice
                                ).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2}>
                        <Button
                            variant='contained'
                            startIcon={<DoneRounded />}
                            fullWidth
                            className='mb-2'
                            onClick={handleSelectKit}
                        >
                            Selecionar
                        </Button>
                        <Button
                            variant='contained'
                            startIcon={<EditRounded />}
                            fullWidth
                            onClick={() => setOpen(true)}
                        >
                            Editar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <KitModal
                kit={kit}
                setKit={setKit}
                open={open}
                onClose={() => setOpen(false)}
            />
        </React.Fragment>
    )
}
