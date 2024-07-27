import { useTheme } from '@mui/material'
import { BudgetResult } from '../../../../../types/BudgetTypes'
import ResponsiveBarChart from '../../../../template/ResponsiveBarChart/ResponsiveBarChart'

export default function TotalInvestmentReturn({
    result,
}: {
    result: BudgetResult
}) {
    const theme = useTheme()

    return (
        <ResponsiveBarChart
            data={{
                labels: Array.from({ length: 24 }, (_, i) => `${i + 2} anos`),
                datasets: [
                    {
                        label: 'Rentabilidade total do investimento',
                        data: result.investmentReturn
                            .slice(1)
                            .map((value) => parseFloat(value.toFixed(2))),
                        backgroundColor: theme.palette.success.light,
                        borderWidth: 0,
                    },
                ],
            }}
            options={{ plugins: { title: { display: true } } }}
            title='Rentabilidade total do investimento'
        />
    )
}
