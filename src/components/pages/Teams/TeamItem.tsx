import { EditRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Paper,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'
import { useState } from 'react'
import { Seller } from '../../../types/EntityTypes'
import { Team } from '../../../types/TeamType'
import { Unit } from '../../../types/UnitType'
import NewTeam from './NewTeam/NewTeam'

export default function TeamItem({
    team,
}: {
    team: Team & { sellers: Seller[]; unit: Unit }
}) {
    const theme = useTheme()
    const [open, setOpen] = useState(false)

    const getDataForEdit = (): Team => {
        const managerId =
            typeof team.manager === 'string' ? team.manager : team.manager.id
        const teamToEdit = {
            id: team.id,
            name: team.name,
            unit: team.unit.id,
            manager: managerId,
            sellers: team.sellers.map((seller) => seller.id),
        }

        return teamToEdit as Team
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h6'>Equipe: {team.name}</Typography>
                    <Tooltip title='Editar equipe'>
                        <Button
                            sx={{ minWidth: 0, padding: '0px 5px' }}
                            variant='contained'
                            onClick={() => setOpen(true)}
                        >
                            <EditRounded fontSize='small' />
                        </Button>
                    </Tooltip>
                </Box>
                <Typography variant='body1'>Vendedores associados:</Typography>
                <Paper
                    className='mt-1 p-0 border'
                    data-bs-theme={theme.palette.mode}
                    elevation={0}
                    sx={{
                        maxHeight: '235px',
                        overflowY: 'auto',
                    }}
                >
                    {team.sellers.map((seller, index) => (
                        <Box key={`${seller.id}-${index}`}>
                            <Box className='p-2 py-1'>
                                <Typography variant='body1'>
                                    {seller.name || 'Vendedor Indefinido'}
                                </Typography>
                            </Box>
                            {index !== team.sellers.length - 1 && (
                                <Divider
                                    className='my-1'
                                    sx={{
                                        borderColor: theme.palette.text.primary,
                                    }}
                                    variant='fullWidth'
                                />
                            )}
                        </Box>
                    ))}
                </Paper>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    Total de vendedores: {team.sellers.length}
                </Typography>
                <Typography>Unidade: {team.unit?.name}</Typography>
                <NewTeam
                    open={open}
                    onClose={() => setOpen(false)}
                    teamToEdit={getDataForEdit()}
                />
            </CardContent>
        </Card>
    )
}
