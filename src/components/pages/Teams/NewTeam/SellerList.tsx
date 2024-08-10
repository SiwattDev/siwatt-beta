import { AddRounded, DeleteRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    Card,
    CardContent,
    FormGroup,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { Seller } from '../../../../types/EntityTypes'
import { Team } from '../../../../types/TeamType'

interface SellerListProps {
    team: Team
    sellers: Seller[]
    activeSeller: Seller | null
    setActiveSeller: React.Dispatch<React.SetStateAction<Seller | null>>
    handleAddSeller: () => void
    setTeam: React.Dispatch<React.SetStateAction<Team>>
}

const SellerList: React.FC<SellerListProps> = ({
    team,
    sellers,
    activeSeller,
    setActiveSeller,
    handleAddSeller,
    setTeam,
}) => {
    const handleRemoveSeller = (sellerId: string) => {
        setTeam((prevTeam) => ({
            ...prevTeam,
            sellers: (prevTeam.sellers as string[]).filter(
                (seller) => seller !== sellerId
            ),
        }))
    }

    return (
        <>
            <Typography className='mt-3'>Vendedores Associados</Typography>
            <Paper className='p-2 pb-1'>
                {team.sellers.length ? (
                    team.sellers.map((sellerId) => {
                        const sellerData = sellers.find(
                            (s) => s.id === sellerId
                        )
                        return (
                            <Card
                                elevation={3}
                                key={sellerId as string}
                                className='mb-1'
                            >
                                <CardContent className='py-1 px-2 d-flex justify-content-between align-items-center'>
                                    <Typography>{sellerData?.name}</Typography>
                                    <Tooltip
                                        title={`Remover ${sellerData?.name} da equipe`}
                                    >
                                        <IconButton
                                            size='small'
                                            onClick={() =>
                                                handleRemoveSeller(
                                                    sellerId as string
                                                )
                                            }
                                        >
                                            <DeleteRounded fontSize='small' />
                                        </IconButton>
                                    </Tooltip>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <Typography className='text-center'>
                        Nenhum vendedor adicionado
                    </Typography>
                )}
            </Paper>
            <FormGroup
                className='row container mt-2'
                sx={{
                    width: '100%',
                    padding: '0px',
                    margin: '0',
                    flexDirection: 'row',
                }}
            >
                <TextField
                    select
                    size='small'
                    variant='outlined'
                    label='Adicionar Vendedor'
                    className='col-10'
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '5px 0px 0px 5px',
                        },
                    }}
                    value={activeSeller?.id || ''}
                    onChange={(e) => {
                        const sellerId = e.target.value
                        const sellerSelected = sellers.find(
                            (seller) => seller.id === sellerId
                        )
                        setActiveSeller(sellerSelected || null)
                    }}
                >
                    {sellers.map((seller) => (
                        <MenuItem key={seller.id} value={seller.id}>
                            {seller.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Tooltip title='Adicionar'>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: 0,
                            width: 'auto',
                            height: 'inherit',
                        }}
                    >
                        <Button
                            variant='contained'
                            size='small'
                            className='rounded-0 rounded-end col-2'
                            sx={{ height: '100%' }}
                            disabled={!activeSeller}
                            onClick={handleAddSeller}
                        >
                            <AddRounded />
                        </Button>
                    </Box>
                </Tooltip>
            </FormGroup>
        </>
    )
}

export default SellerList
