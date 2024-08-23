import { Card, CardContent, useTheme } from '@mui/material'
import Chart from 'chart.js/auto'
import 'chartjs-plugin-datalabels'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut } from 'react-chartjs-2'
import { Budget } from '../../../../types/BudgetTypes'

Chart.register(ChartDataLabels)

export default function BudgetsChart({ budgets }: { budgets: Budget[] }) {
    const theme = useTheme()

    const budgetsByStatus = budgets.reduce((acc: any, budget) => {
        const status = budget.status || 'opened'
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {})

    const totalBudgets = budgets.length

    const statusColor: Record<
        'opened' | 'in-progress' | 'closed' | 'cancelled',
        string
    > = {
        closed: '#1E4D92',
        opened: '#F57C00',
        cancelled: '#E53935',
        'in-progress': '#43A047',
    }

    const translatedLabels: Record<string, string> = {
        opened: 'Em aberto',
        'in-progress': 'Em andamento',
        closed: 'Fechado',
        cancelled: 'Cancelado',
    }

    const chartLabels = Object.keys(budgetsByStatus).map(
        (status) => translatedLabels[status] || status
    )

    return (
        <Card elevation={3} style={{ height: '100%' }}>
            <CardContent
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <div style={{ flexGrow: 1 }}>
                    <Doughnut
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Orçamentos por Status',
                                    color: theme.palette.text.primary,
                                    font: {
                                        size: 20,
                                        family: '"Roboto","Helvetica","Arial",sans-serif',
                                    },
                                },
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                    labels: {
                                        color: theme.palette.text.primary,
                                        font: {
                                            size: 14,
                                        },
                                    },
                                },
                                datalabels: {
                                    color: 'white',
                                    font: {
                                        weight: 'bold',
                                    },
                                    formatter: (value: number) => {
                                        const percentage = (
                                            (value / totalBudgets) *
                                            100
                                        ).toFixed(1)
                                        return `${percentage}%`
                                    },
                                },
                            },
                        }}
                        data={{
                            labels: chartLabels,
                            datasets: [
                                {
                                    borderWidth: 0,
                                    data: Object.values(budgetsByStatus),
                                    backgroundColor: Object.keys(
                                        budgetsByStatus
                                    ).map(
                                        (status) =>
                                            statusColor[
                                                status as keyof typeof statusColor
                                            ]
                                    ),
                                },
                            ],
                        }}
                        style={{
                            height: '100%',
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
