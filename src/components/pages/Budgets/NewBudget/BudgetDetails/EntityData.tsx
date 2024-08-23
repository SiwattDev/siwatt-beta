import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { BudgetWithClientData } from '../../../../../types/BudgetTypes'
import { Client, Seller } from '../../../../../types/EntityTypes'

function Item({
    entity,
    type,
}: {
    entity: Client | Seller
    type: 'client' | 'seller'
}) {
    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                {type === 'client' ? 'Cliente' : 'Vendedor'}:
            </Typography>
            <Card elevation={3}>
                <CardContent>
                    <Typography>
                        <strong>Razão Social:</strong> {entity.name}
                    </Typography>
                    <Typography>
                        <strong>Email:</strong> {entity.email}
                    </Typography>
                    <Typography>
                        <strong>Telefone:</strong> {entity.phone}
                    </Typography>
                    <Typography>
                        <strong>Endereço:</strong> {entity.address.city},{' '}
                        {entity.address.uf}, {entity.address.cep}
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default function EntityData({
    budget,
}: {
    budget: BudgetWithClientData
}) {
    return (
        <React.Fragment>
            <Item entity={budget.client} type='client' />
            <Box className='mb-3' />
            <Item entity={budget.seller} type='seller' />
        </React.Fragment>
    )
}
