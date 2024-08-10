import { AccessTimeRounded } from '@mui/icons-material'
import { Card, CardContent, Typography } from '@mui/material'
import { Visit } from '../../../../../types/VisitTypes'

export default function VisitTime({ visit }: { visit: Visit }) {
    function getPeriodOfDay(date: Date) {
        const hour = date.getHours()
        if (hour < 6) return 'Madrugada'
        else if (hour < 12) return 'Manhã'
        else if (hour < 18) return 'Tarde'
        else return 'Noite'
    }

    function getDayOfWeek(date: Date) {
        const daysOfWeek = [
            'Domingo',
            'Segunda-feira',
            'Terça-feira',
            'Quarta-feira',
            'Quinta-feira',
            'Sexta-feira',
            'Sábado',
        ]
        return daysOfWeek[date.getDay()]
    }

    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>
                    <AccessTimeRounded
                        sx={{ verticalAlign: 'text-top', mr: 1 }}
                    />
                    Data e Hora da Visita
                </Typography>
                <Typography>
                    <strong>Data:</strong>{' '}
                    {new Date(visit.date).toLocaleDateString('pt-BR')} -{' '}
                    {getDayOfWeek(new Date(visit.date))}
                </Typography>
                <Typography>
                    <strong>Hora:</strong>{' '}
                    {new Date(visit.date).toLocaleTimeString()} -{' '}
                    {getPeriodOfDay(new Date(visit.date))}
                </Typography>
            </CardContent>
        </Card>
    )
}
