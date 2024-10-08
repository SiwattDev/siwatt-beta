import { Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DirectContact as DirectContactData } from '../../../../types/EntityTypes'

export default function DirectContact({
    onChange,
    directContactData,
}: {
    onChange: (v: DirectContactData) => void
    directContactData?: DirectContactData
}) {
    const [directContact, setDirectContact] = useState({} as DirectContactData)

    useEffect(() => {
        onChange(directContact)
    }, [directContact])

    useEffect(() => {
        if (directContactData) setDirectContact(directContactData)
    }, [directContactData])

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Contato direto:
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Nome'
                        size='small'
                        fullWidth
                        required
                        value={directContact.name || ''}
                        onChange={(e) =>
                            setDirectContact({
                                ...directContact,
                                name: e.target.value,
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Email'
                        size='small'
                        fullWidth
                        value={directContact.email || ''}
                        onChange={(e) =>
                            setDirectContact({
                                ...directContact,
                                email: e.target.value,
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Telefone'
                        size='small'
                        fullWidth
                        required
                        value={directContact.phone || ''}
                        onChange={(e) =>
                            setDirectContact({
                                ...directContact,
                                phone: parseInt(e.target.value),
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Data de nascimento'
                        size='small'
                        fullWidth
                        value={directContact.birthday || ''}
                        onChange={(e) =>
                            setDirectContact({
                                ...directContact,
                                birthday: e.target.value,
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='CPF'
                        size='small'
                        fullWidth
                        value={directContact.cpf || ''}
                        onChange={(e) =>
                            setDirectContact({
                                ...directContact,
                                cpf: e.target.value,
                            })
                        }
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
