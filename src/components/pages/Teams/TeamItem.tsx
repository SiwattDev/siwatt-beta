import {
    Box,
    Card,
    CardContent,
    Divider,
    Paper,
    Typography,
    useTheme,
} from '@mui/material'
import { Seller } from '../../../types/EntityTypes'
import { Team } from '../../../types/TeamType'
import { Unit } from '../../../types/UnitType'

export default function TeamItem({
    team,
}: {
    team: Team & { sellers: Seller[]; unit: Unit }
}) {
    const theme = useTheme()

    return (
        <Card>
            <CardContent>
                <Typography variant='h6'>Equipe: {team.name}</Typography>
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
            </CardContent>
        </Card>
    )
}
