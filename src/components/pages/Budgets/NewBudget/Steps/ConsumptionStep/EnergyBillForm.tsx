import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../../../contexts/AlertContext'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { baseURL } from '../../../../../../globals'
import useUtils from '../../../../../../hooks/useUtils'
import { EnergyBill } from '../../../../../../types/BudgetTypes'
import FileLoader from '../../../../../template/FileLoader/FileLoader'

export default function EnergyBillForm({
    open,
    onClose,
    energyBillToEdit,
}: {
    open: boolean
    onClose: (energyBill: EnergyBill | null) => void
    energyBillToEdit?: EnergyBill | null
}) {
    const { budget, setBudget } = useContext(BudgetContext)
    const [energyBill, setEnergyBill] = useState<EnergyBill>(
        energyBillToEdit || ({} as EnergyBill)
    )
    const [loading, setLoading] = useState(false)
    const [billImage, setBillImage] = useState<File | null>(null)
    const [chartImage, setChartImage] = useState<File | null>(null)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const months = [
        'JAN',
        'FEV',
        'MAR',
        'ABR',
        'MAI',
        'JUN',
        'JUL',
        'AGO',
        'SET',
        'OUT',
        'NOV',
        'DEZ',
    ]

    useEffect(() => {
        if (energyBillToEdit) {
            setEnergyBill(energyBillToEdit)
            // Carregar URLs de imagens se existir
            if (energyBillToEdit.photoEnergyBill) {
                setBillImage(null) // Resetting the File type
            }
            if (energyBillToEdit.photoConsumptionGraph) {
                setChartImage(null) // Resetting the File type
            }
        }
    }, [energyBillToEdit])

    const handleAddEnergyBill = async () => {
        if (!billImage && !energyBill.photoEnergyBill) {
            showAlert({
                message: 'Por favor, adicione a imagem da conta de energia.',
                type: 'error',
            })
            return
        }

        if (!chartImage && !energyBill.photoConsumptionGraph) {
            showAlert({
                message: 'Por favor, adicione a imagem do gráfico de consumo.',
                type: 'error',
            })
            return
        }

        setLoading(true)

        try {
            let photoEnergyBillUrl = energyBill.photoEnergyBill
            let photoConsumptionGraphUrl = energyBill.photoConsumptionGraph

            if (billImage) {
                const formData1 = new FormData()
                formData1.append('file', billImage)
                formData1.append('destinationPath', 'energyBills')
                const response1 = await axios.post(
                    `${baseURL}/files`,
                    formData1
                )
                photoEnergyBillUrl = response1.data.url
            }

            if (chartImage) {
                const formData2 = new FormData()
                formData2.append('file', chartImage)
                formData2.append('destinationPath', 'energyBills')
                const response2 = await axios.post(
                    `${baseURL}/files`,
                    formData2
                )
                photoConsumptionGraphUrl = response2.data.url
            }

            const newEnergyBill: EnergyBill = {
                ...energyBill,
                photoEnergyBill: photoEnergyBillUrl,
                photoConsumptionGraph: photoConsumptionGraphUrl,
            }

            if (energyBillToEdit) {
                setBudget({
                    ...budget,
                    consumption: {
                        ...budget.consumption,
                        energyBills: budget.consumption.energyBills.map(
                            (bill) =>
                                bill.id === newEnergyBill.id
                                    ? newEnergyBill
                                    : bill
                        ),
                    },
                })
            } else {
                setBudget({
                    ...budget,
                    consumption: {
                        ...budget.consumption,
                        energyBills: [
                            ...(budget.consumption?.energyBills || []),
                            newEnergyBill,
                        ],
                    },
                })
            }

            onClose(newEnergyBill)
            setEnergyBill({} as EnergyBill)
        } catch (error) {
            console.log(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={() => {
                    setEnergyBill({} as EnergyBill)
                    onClose(null)
                }}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>
                    {energyBillToEdit
                        ? 'Editar conta de energia'
                        : 'Adicionar conta de energia'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label='ID da conta de energia'
                                size='small'
                                fullWidth
                                required
                                value={energyBill.id || ''}
                                onChange={(event) =>
                                    setEnergyBill({
                                        ...energyBill,
                                        id: event.target.value,
                                    })
                                }
                            />
                        </Grid>
                        {months.map((month) => (
                            <Grid item xs={12} sm={6} md={4} key={month}>
                                <TextField
                                    type='number'
                                    label={month}
                                    size='small'
                                    required
                                    fullWidth
                                    value={energyBill?.months?.[month] || ''}
                                    onChange={(event) => {
                                        setEnergyBill({
                                            ...energyBill,
                                            months: {
                                                ...energyBill?.months,
                                                [month]: parseInt(
                                                    event.target.value
                                                ),
                                            },
                                        })
                                    }}
                                />
                            </Grid>
                        ))}
                        <Grid container item xs={12} md={6}>
                            <Grid item xs={12}>
                                <Typography className='mb-1'>
                                    Foto da conta de energia:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FileLoader
                                    acceptedTypes={['png', 'jpg', 'jpeg']}
                                    maxQuantity={1}
                                    onFilesChanged={(files) =>
                                        setBillImage(files[0])
                                    }
                                    initialFiles={
                                        energyBillToEdit?.photoEnergyBill &&
                                        !billImage
                                            ? [
                                                  {
                                                      name: 'photoEnergyBill',
                                                      url: energyBillToEdit.photoEnergyBill,
                                                  },
                                              ]
                                            : []
                                    }
                                    sx={{ height: '150px', overflow: 'hidden' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} md={6}>
                            <Grid item xs={12}>
                                <Typography className='mb-1'>
                                    Foto do gráfico de consumo:
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FileLoader
                                    acceptedTypes={['png', 'jpg', 'jpeg']}
                                    maxQuantity={1}
                                    onFilesChanged={(files) =>
                                        setChartImage(files[0])
                                    }
                                    initialFiles={
                                        energyBillToEdit?.photoConsumptionGraph &&
                                        !chartImage
                                            ? [
                                                  {
                                                      name: 'photoConsumptionGraph',
                                                      url: energyBillToEdit.photoConsumptionGraph,
                                                  },
                                              ]
                                            : []
                                    }
                                    sx={{ height: '150px', overflow: 'hidden' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setEnergyBill({} as EnergyBill)
                            onClose(null)
                        }}
                        variant='text'
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAddEnergyBill}
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : energyBillToEdit ? (
                            'Editar'
                        ) : (
                            'Adicionar'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
