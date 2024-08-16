import { useTheme } from '@mui/material'
import { Budget, BudgetResult } from '../../../../../types/BudgetTypes'
import ResponsiveBarChart from '../../../../template/ResponsiveBarChart/ResponsiveBarChart'

const colors = [
    'rgb(75, 192, 192)',
    'rgb(255, 205, 86)',
    'rgb(201, 203, 207)',
    'rgb(255, 159, 64)',
    'rgb(255, 99, 71)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(123, 239, 178)',
    'rgb(255, 99, 132)',
    'rgb(255, 182, 193)',
    'rgb(244, 164, 96)',
    'rgb(173, 216, 230)',
    'rgb(60, 179, 113)',
    'rgb(233, 150, 122)',
    'rgb(255, 228, 181)',
    'rgb(70, 130, 180)',
    'rgb(135, 206, 250)',
]

const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
]

function shuffle(array: string[]) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

export default function MonthlyGeneration({
    result,
    budget,
}: {
    result: BudgetResult
    budget: Budget
}) {
    const theme = useTheme()
    const shuffledColors = shuffle(colors)

    return (
        <div style={{ height: '400px' }}>
            <ResponsiveBarChart
                data={{
                    labels: months,
                    datasets: [
                        {
                            label: 'Geração Estimada',
                            data: result.energyGeneration,
                            backgroundColor: theme.palette.primary.main,
                            borderWidth: 0,
                        },
                        ...budget.consumption.energyBills.map(
                            (energyBill, index) => ({
                                label: energyBill.id,
                                data: Object.values(energyBill.months),
                                backgroundColor:
                                    shuffledColors[
                                        index % shuffledColors.length
                                    ],
                                borderWidth: 0,
                            })
                        ),
                    ],
                }}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: 'Geração Mensal (KWh)',
                            color: theme.palette.text.primary,
                            font: {
                                size: 20,
                                family: '"Roboto","Helvetica","Arial",sans-serif',
                            },
                        },
                    },
                }}
                title='Geração Mensal (KWh)'
            />
        </div>
    )
}
