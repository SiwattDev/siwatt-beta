import {
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { BudgetWithClientData } from '../../../../types/BudgetTypes'

type BudgetStatus = 'opened' | 'in-progress' | 'closed' | 'cancelled'

function replaceBudgetStatus(status: BudgetStatus) {
    switch (status) {
        case 'opened':
            return 'Em aberto'
        case 'in-progress':
            return 'Em andamento'
        case 'closed':
            return 'Fechado'
        case 'cancelled':
            return 'Cancelado'
    }
}

const StyledTableCell = styled(TableCell)(() => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}))

export default function BudgetsTable({
    budgets,
}: {
    budgets: BudgetWithClientData[]
}) {
    const totalKwp = budgets.reduce(
        (acc, budget) => acc + budget.peakGeneration,
        0
    )
    const totalMoney = budgets.reduce(
        (acc, budget) => acc + budget.plantValue,
        0
    )

    return (
        <TableContainer component={Paper}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell>Cliente</StyledTableCell>
                        <StyledTableCell>Vendedor</StyledTableCell>
                        <StyledTableCell>Data</StyledTableCell>
                        <StyledTableCell>Tamanho da Usina</StyledTableCell>
                        <StyledTableCell>Valor</StyledTableCell>
                        <StyledTableCell>Cidade</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {budgets &&
                        budgets.length > 0 &&
                        budgets.map((budget) => (
                            <TableRow key={budget.id}>
                                <StyledTableCell>
                                    <Link
                                        to={`/dashboard/budgets/${budget.id}`}
                                    >
                                        {budget.id}
                                    </Link>
                                </StyledTableCell>
                                <StyledTableCell>
                                    {budget.client.name}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {budget.seller.name}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {new Date(
                                        budget.createdAt
                                    ).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {budget.peakGeneration} kWp
                                </StyledTableCell>
                                <StyledTableCell>
                                    {budget.plantValue.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {budget.solarPlantSite.city}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {replaceBudgetStatus(
                                        (budget.status as BudgetStatus) ||
                                            'opened'
                                    )}
                                </StyledTableCell>
                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell colSpan={4}>Total:</StyledTableCell>
                        <StyledTableCell>{totalKwp} kWp</StyledTableCell>
                        <StyledTableCell>
                            {totalMoney.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                        </StyledTableCell>
                        <StyledTableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
