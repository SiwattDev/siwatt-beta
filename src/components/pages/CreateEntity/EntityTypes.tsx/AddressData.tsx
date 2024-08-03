import { Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Address } from '../../../../types/EntityTypes'

export default function AddressData({
    onChange,
}: {
    onChange: (v: Address) => void
}) {
    const [address, setAddress] = useState({} as Address)

    useEffect(() => {
        onChange(address)
    }, [address])

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Endereço:
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Cep'
                        size='small'
                        fullWidth
                        value={address.cep || ''}
                        required
                        onChange={(e) =>
                            setAddress({ ...address, cep: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Rua'
                        size='small'
                        fullWidth
                        required
                        value={address.street || ''}
                        onChange={(e) =>
                            setAddress({ ...address, street: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Cidade'
                        size='small'
                        fullWidth
                        required
                        value={address.city || ''}
                        onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='UF'
                        size='small'
                        fullWidth
                        required
                        value={address.uf || ''}
                        onChange={(e) =>
                            setAddress({ ...address, uf: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Número'
                        size='small'
                        fullWidth
                        value={address.number || ''}
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                number: parseInt(e.target.value),
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Bairro'
                        size='small'
                        fullWidth
                        required
                        value={address.neighborhood || ''}
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                neighborhood: e.target.value,
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Referência'
                        size='small'
                        fullWidth
                        value={address.reference || ''}
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                reference: e.target.value,
                            })
                        }
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
