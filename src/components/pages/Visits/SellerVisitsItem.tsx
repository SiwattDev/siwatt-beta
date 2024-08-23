import { Card, CardContent, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Seller } from '../../../types/EntityTypes'
import { Visit } from '../../../types/VisitTypes'

type SellerWithVisits = {
    seller: Seller
    visits: Visit[]
}

export default function SellerVisitsItem({ data }: { data: SellerWithVisits }) {
    const navigate = useNavigate()
    const styleOneLine = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }

    return (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'skew(3deg, 3deg) scale(0.9)',
                    background:
                        'linear-gradient(132deg, #ffffff3d, #0e0f100d 70%)',
                },
            }}
            onClick={() => navigate('seller/' + data.seller.id)}
        >
            <CardContent>
                <Typography variant='h6' sx={styleOneLine}>
                    Vendedor: {data.seller.name}
                </Typography>
                <Typography sx={styleOneLine}>
                    <strong>E-mail:</strong> {data.seller.email}
                </Typography>
                <Typography sx={styleOneLine}>
                    <strong>Telefone:</strong> {data.seller.phone}
                </Typography>
                <Typography sx={styleOneLine}>
                    <strong>Local:</strong> {data.seller.address.city} -{' '}
                    {data.seller.address.uf}
                </Typography>
                <Typography sx={styleOneLine}>
                    <strong>Total de visitas:</strong> {data.visits.length}
                </Typography>
            </CardContent>
        </Card>
    )
}
