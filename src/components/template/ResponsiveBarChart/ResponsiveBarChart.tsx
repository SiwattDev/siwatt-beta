import { Card, CardContent, useMediaQuery, useTheme } from '@mui/material'
import { ChartData, ChartOptions } from 'chart.js'
import 'chart.js/auto'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

interface ResponsiveBarChartProps {
    data: ChartData<'bar'>
    options: ChartOptions<'bar'>
    title: string
}

export default function ResponsiveBarChart({
    data,
    options,
    title,
}: ResponsiveBarChartProps) {
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

    const [responsiveOptions, setResponsiveOptions] = useState<
        ChartOptions<'bar'>
    >({
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isMdUp ? 'x' : 'y',
        plugins: {
            ...options.plugins,
            title: {
                display: true,
                text: title,
                color: theme.palette.text.primary,
                font: {
                    size: 20,
                    family: '"Roboto","Helvetica","Arial",sans-serif',
                },
            },
        },
    })

    useEffect(() => {
        setResponsiveOptions({
            ...options,
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: isMdUp ? 'x' : 'y',
            plugins: {
                ...options.plugins,
                datalabels: {
                    display: false,
                },
                title: {
                    display: true,
                    text: title,
                    color: theme.palette.text.primary,
                    font: {
                        size: 20,
                        family: '"Roboto","Helvetica","Arial",sans-serif',
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: theme.palette.text.primary,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: theme.palette.text.primary,
                    },
                },
            },
        })
    }, [isMdUp, options, title, theme.palette.text.primary])

    return (
        <Card elevation={3} style={{ height: '100%' }}>
            <CardContent style={{ height: '100%' }}>
                <div
                    style={{
                        maxHeight: '400px',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Bar data={data} options={responsiveOptions} />
                </div>
            </CardContent>
        </Card>
    )
}
