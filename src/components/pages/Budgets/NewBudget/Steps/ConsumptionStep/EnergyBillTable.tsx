import { AddRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material'
import { useState } from 'react'
import EnergyBillForm from './EnergyBillForm'

export default function EnergyBillTable() {
    const theme = useTheme()
    const [showAddEnergyBill, setShowAddEnergyBill] = useState<boolean>(false)

    return (
        <Box>
            <Typography variant='h6'>Contas de Energia</Typography>
            <TableContainer component={Paper} className='p-2' elevation={3}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Unidade</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
            <Typography variant='caption' color={theme.palette.text.secondary}>
                Adicione pelo menos uma conta de energia
            </Typography>
            <Box className='mt-2'>
                <Button
                    variant='contained'
                    size='small'
                    onClick={() => setShowAddEnergyBill(true)}
                >
                    <AddRounded /> Adicionar conta de energia
                </Button>
            </Box>
            <EnergyBillForm
                open={showAddEnergyBill}
                onClose={() => setShowAddEnergyBill(false)}
            />
        </Box>
    )
}
