import { HandshakeRounded } from '@mui/icons-material'
import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import PageHeader from '../../template/PageHeader/PageHeader'

export default function Partners() {
    return (
        <React.Fragment>
            <PageHeader
                title='Parceiros'
                icon={<HandshakeRounded />}
                path={['dashboard', 'partners']}
            />
            <Card>
                <CardContent>
                    <Typography variant='h6' className='text-center'>
                        Nenhum parceiro encontrado.
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
