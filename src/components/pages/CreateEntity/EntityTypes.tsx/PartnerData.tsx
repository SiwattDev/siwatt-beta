import { SaveRounded } from '@mui/icons-material'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { Partner } from '../../../../types/EntityTypes'
import Address from './AddressData'

export default function PartnerData({
    onSave,
}: {
    onSave: (v: Partner) => void
}) {
    const [partner, setPartner] = useState({} as Partner)
    const { showAlert } = useContext(AlertContext)

    const handleSave = () => {
        if (!partner.name || !partner.phone || !partner.address.cep) {
            showAlert({
                message:
                    'Por favor, preencha todos os campos obrigatórios. (*)',
                type: 'error',
            })
            return
        }
        onSave(partner)
    }

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Dados da Entidade:
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Nome'
                        size='small'
                        fullWidth
                        required
                        value={partner.name || ''}
                        onChange={(e) =>
                            setPartner({ ...partner, name: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Email'
                        size='small'
                        fullWidth
                        value={partner.email || ''}
                        onChange={(e) =>
                            setPartner({ ...partner, email: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Telefone'
                        size='small'
                        fullWidth
                        required
                        value={partner.phone || ''}
                        onChange={(e) =>
                            setPartner({ ...partner, phone: e.target.value })
                        }
                    />
                </Grid>
            </Grid>
            <Box className='mb-3' />
            <Address
                onChange={(address) => setPartner({ ...partner, address })}
            />
            <Box className='mb-3' />
            <Button variant='contained' onClick={handleSave}>
                <SaveRounded className='me-1' /> Salvar
            </Button>
        </React.Fragment>
    )
}
