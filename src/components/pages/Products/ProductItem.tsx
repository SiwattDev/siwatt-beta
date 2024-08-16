import { DeleteRounded, EditRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material'
import useUtils from '../../../hooks/useUtils'
import { Product } from '../../../types/BudgetTypes'

export default function ProductItem({ product }: { product: Product }) {
    const { extractNumbers } = useUtils()
    const oneLineStyle = {
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ paddingBottom: '16px !important', padding: 2 }}>
                <Tooltip title={product.model} placement='top'>
                    <Typography sx={oneLineStyle} variant='h6'>
                        {product.model}
                    </Typography>
                </Tooltip>
                <Typography>Potência: {product.power}</Typography>
                <Typography>
                    Preço:{' '}
                    {extractNumbers(product.price as string).toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL',
                        }
                    )}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Switch />
                    <ButtonGroup size='small' variant='contained'>
                        <Button>
                            <EditRounded fontSize='small' />
                        </Button>
                        <Button color='error'>
                            <DeleteRounded fontSize='small' />
                        </Button>
                    </ButtonGroup>
                </Box>
            </CardContent>
        </Card>
    )
}
