import { PersonRounded } from '@mui/icons-material'
import { Card, CardContent, Typography } from '@mui/material'
import { Visit } from '../../../../../types/VisitTypes'

export default function ClientData({ visit }: { visit: Visit }) {
    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>
                    <PersonRounded sx={{ verticalAlign: 'text-top', mr: 1 }} />
                    Dados do Cliente
                </Typography>
                <Typography>
                    <strong>Nome:</strong> {visit.clientData.name}
                </Typography>
                <Typography>
                    <strong>Nome Fantasia:</strong>{' '}
                    {visit.clientData.fantasyName}
                </Typography>
                <Typography>
                    <strong>{visit.clientData.cnpj ? 'CNPJ' : 'CPF'}:</strong>{' '}
                    {visit.clientData.cnpj || visit.clientData.cpf}
                </Typography>
                <Typography>
                    <strong>Telefone:</strong> {visit.clientData.phone}
                </Typography>
            </CardContent>
        </Card>
    )
}
