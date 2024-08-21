import { PersonRounded } from '@mui/icons-material'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Seller } from '../../../../types/EntityTypes'

export default function SellerData({ seller }: { seller: Seller }) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>
                            <PersonRounded /> Informações do Vendedor
                        </Typography>
                        <Typography>
                            <strong>Nome:</strong> {seller.name}
                        </Typography>
                        <Typography>
                            <strong>E-mail:</strong> {seller.email}
                        </Typography>
                        <Typography>
                            <strong>Telefone:</strong> {seller.phone}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>
                            <PersonRounded /> Local do Vendedor
                        </Typography>
                        <Typography>
                            <strong>Cep:</strong> {seller.address.cep}
                        </Typography>
                        <Typography>
                            <strong>Cidade:</strong> {seller.address.city}
                        </Typography>
                        <Typography>
                            <strong>UF:</strong> {seller.address.uf}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
