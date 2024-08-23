import { AddRounded, DeleteRounded, EditRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { EnergyBill } from '../../../../../../types/BudgetTypes'
import EnergyBillForm from './EnergyBillForm'

export default function EnergyBillTable({
    viewOnly = false,
}: {
    viewOnly?: boolean
}) {
    const theme = useTheme()
    const [showAddEnergyBill, setShowAddEnergyBill] = useState<boolean>(false)
    const [energyBillToEdit, setEnergyBillToEdit] = useState<EnergyBill | null>(
        null
    )
    const { budget, setBudget } = useContext(BudgetContext)
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

    const handleEdit = (energyBill: EnergyBill) => {
        setEnergyBillToEdit(energyBill)
        setShowAddEnergyBill(true)
    }

    const handleRemove = (id: string) => {
        setBudget({
            ...budget,
            consumption: {
                ...budget.consumption,
                energyBills: budget.consumption.energyBills.filter(
                    (bill) => bill.id !== id
                ),
            },
        })
    }

    return (
        <Box>
            <Typography variant='h6' className='mb-2'>
                Contas de Energia:
            </Typography>
            <TableContainer component={Paper} className='p-2' elevation={3}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mês</TableCell>
                            {budget.consumption?.energyBills?.map(
                                (energyBill) => (
                                    <TableCell key={energyBill.id}>
                                        <Box display='flex' alignItems='center'>
                                            {energyBill.id}
                                            {!viewOnly && (
                                                <React.Fragment>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEdit(
                                                                energyBill
                                                            )
                                                        }
                                                    >
                                                        <EditRounded fontSize='small' />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleRemove(
                                                                energyBill.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteRounded fontSize='small' />
                                                    </IconButton>
                                                </React.Fragment>
                                            )}
                                        </Box>
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budget.consumption?.energyBills ? (
                            <React.Fragment>
                                {months.map((month) => (
                                    <TableRow key={month}>
                                        <TableCell>{month}</TableCell>
                                        {budget.consumption?.energyBills?.map(
                                            (energyBill) => (
                                                <TableCell key={energyBill.id}>
                                                    {energyBill.months[month] ||
                                                        '-'}
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={12}>
                                    Nenhuma conta de energia adicionada
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {!viewOnly && (
                <React.Fragment>
                    <Typography
                        variant='caption'
                        color={theme.palette.text.secondary}
                    >
                        Adicione pelo menos uma conta de energia
                    </Typography>
                    <Box className='mt-2'>
                        <Button
                            variant='contained'
                            size='small'
                            onClick={() => {
                                setEnergyBillToEdit(null)
                                setShowAddEnergyBill(true)
                            }}
                        >
                            <AddRounded /> Adicionar conta de energia
                        </Button>
                    </Box>
                    <EnergyBillForm
                        open={showAddEnergyBill}
                        onClose={(newEnergyBill) => {
                            setShowAddEnergyBill(false)
                            if (newEnergyBill) {
                                if (energyBillToEdit) {
                                    setBudget({
                                        ...budget,
                                        consumption: {
                                            ...budget.consumption,
                                            energyBills:
                                                budget.consumption.energyBills.map(
                                                    (bill) =>
                                                        bill.id ===
                                                        newEnergyBill.id
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
                                                ...(budget.consumption
                                                    ?.energyBills || []),
                                                newEnergyBill,
                                            ],
                                        },
                                    })
                                }
                            }
                        }}
                        energyBillToEdit={energyBillToEdit}
                    />
                </React.Fragment>
            )}
        </Box>
    )
}
