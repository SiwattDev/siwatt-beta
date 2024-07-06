import {
    DeleteRounded,
    EditRounded,
    LockClockRounded,
    LockOpenRounded,
    LockRounded,
    LoopRounded,
    NoEncryptionRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material'
import { Budget } from '../../../types/BudgetTypes'
import { Client } from '../../../types/EntityTypes'

export default function BudgetItem({ budget }: { budget: Budget }) {
    const status: {
        status: string
        text: string
        color: AlertColor
        icon: JSX.Element
    }[] = [
        {
            status: 'opened',
            text: 'Em aberto',
            color: 'warning' as AlertColor,
            icon: <LockOpenRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'in-progress',
            text: 'Em andamento',
            color: 'success' as AlertColor,
            icon: <LockClockRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'closed',
            text: 'Fechado',
            color: 'primary' as AlertColor,
            icon: <LockRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'cancelled',
            text: 'Cancelado',
            color: 'error' as AlertColor,
            icon: <NoEncryptionRounded className='me-1' fontSize='small' />,
        },
    ]

    const currentStatus =
        status.find((s) => s.status === budget.status) || status[0]

    function isClient(client: any): client is Client {
        return (client as Client).name !== undefined
    }

    const client = isClient(budget.client) ? budget.client : null

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent
                sx={{ height: '100%' }}
                className='d-flex flex-column justify-content-between'
            >
                <Box>
                    <Typography>
                        <strong>Cliente:</strong>{' '}
                        {client ? client.name : 'Cliente desconhecido'}
                    </Typography>
                    <Typography>
                        <strong>Número da Proposta:</strong> {budget.id}
                    </Typography>
                    <Typography>
                        <strong>Tamanho da Usina:</strong>{' '}
                        {budget.peakGeneration}
                    </Typography>
                    <Typography>
                        <strong>
                            {client && client.cpf ? 'CPF:' : 'CNPJ:'}
                        </strong>{' '}
                        {client ? client.cpf || client.cnpj : 'N/A'}
                    </Typography>
                    <Typography>
                        <strong>Telefone:</strong>{' '}
                        {client ? client.phone : 'N/A'}
                    </Typography>
                </Box>
                <Grid container spacing={2} className='mt-2'>
                    <Grid item xs={12}>
                        <Alert
                            severity={currentStatus.color}
                            icon={currentStatus.icon}
                        >
                            {currentStatus.text}
                        </Alert>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color='primary'
                            startIcon={<VisibilityRounded />}
                            variant='contained'
                            fullWidth
                        >
                            Ver
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color='primary'
                            startIcon={<EditRounded />}
                            variant='contained'
                            fullWidth
                        >
                            Editar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color='error'
                            startIcon={<DeleteRounded />}
                            variant='contained'
                            fullWidth
                        >
                            Excluir
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color='primary'
                            startIcon={<LoopRounded />}
                            variant='contained'
                            fullWidth
                        >
                            Status
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
