import { useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Visit } from '../../../../types/VisitTypes'
import ResponsiveBarChart from '../../../template/ResponsiveBarChart/ResponsiveBarChart'

type DateRange = {
    startDate: string
    endDate: string
}

type VisitsGraphProps = {
    dateRange: DateRange
    visits: Visit[]
}

export default function VisitsGraph({ dateRange, visits }: VisitsGraphProps) {
    const theme = useTheme()

    const generateChartData = useMemo(() => {
        const startDate = dayjs(dateRange.startDate)
        const endDate = dayjs(dateRange.endDate)
        const allDates = []
        let currentDate = startDate
        while (currentDate.isSameOrBefore(endDate)) {
            allDates.push(currentDate.format('YYYY-MM-DD'))
            currentDate = currentDate.add(1, 'day')
        }

        const counts = allDates.reduce((acc: any, date) => {
            acc[date] = 0
            return acc
        }, {})

        visits.forEach((visit) => {
            const dateString = dayjs(visit.date).format('YYYY-MM-DD')
            counts[dateString] = (counts[dateString] || 0) + 1
        })

        const sortedDates = Object.keys(counts).sort((a, b) =>
            dayjs(a).isBefore(dayjs(b)) ? -1 : 1
        )

        const data = {
            labels: sortedDates.map((date) => dayjs(date).format('DD/MM/YYYY')),
            datasets: [
                {
                    label: 'Visitas',
                    data: sortedDates.map((date) => counts[date]),
                    backgroundColor: theme.palette.success.light,
                    borderWidth: 0,
                },
            ],
        }

        return data
    }, [dateRange])

    return (
        <ResponsiveBarChart
            data={generateChartData}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: 'Visitas por Data',
                        color: theme.palette.text.primary,
                        font: {
                            size: 20,
                            family: '"Roboto","Helvetica","Arial",sans-serif',
                        },
                    },
                },
                animation: false,
            }}
            title='Visitas por Data'
        />
    )
}
