import { SaveRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { Supplier } from '../../../../types/EntityTypes'
import Address from './AddressData'
import DirectContact from './DirectContact'

type EntityTypes = 'individual' | 'legal'

export default function SupplierData({
    onSave,
}: {
    onSave: (v: Supplier) => void
}) {
    const [typeEntity, setTypeEntity] = useState<EntityTypes>('individual')
    const [supplier, setSupplier] = useState<Supplier>({} as Supplier)
    const { showAlert } = useContext(AlertContext)

    const handleSave = () => {
        if (
            (typeEntity === 'legal' && !supplier.cnpj) ||
            (typeEntity === 'individual' && !supplier.cpf) ||
            !supplier.name ||
            !supplier.phone ||
            !supplier.address.cep
        ) {
            showAlert({
                message:
                    'Por favor, preencha todos os campos obrigatórios. (*)',
                type: 'error',
            })
            return
        }
        onSave(supplier)
    }

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Dados da Entidade:
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl size='small' fullWidth>
                        <InputLabel>Tipo de Entidade</InputLabel>
                        <Select
                            label='Tipo de Entidade'
                            value={typeEntity}
                            onChange={(e) =>
                                setTypeEntity(e.target.value as EntityTypes)
                            }
                        >
                            <MenuItem value='individual'>
                                Pessoa Física
                            </MenuItem>
                            <MenuItem value='legal'>Pessoa Jurídica</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {typeEntity === 'legal' && (
                    <React.Fragment>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label='CNPJ'
                                size='small'
                                fullWidth
                                required
                                value={supplier.cnpj || ''}
                                onChange={(e) =>
                                    setSupplier({
                                        ...supplier,
                                        cnpj: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label='Inscrição Estadual'
                                size='small'
                                fullWidth
                                value={supplier.stateRegistration || ''}
                                onChange={(e) =>
                                    setSupplier({
                                        ...supplier,
                                        stateRegistration: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </React.Fragment>
                )}
                {typeEntity === 'individual' && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            label='CPF'
                            size='small'
                            fullWidth
                            required
                            value={supplier.cpf || ''}
                            onChange={(e) =>
                                setSupplier({
                                    ...supplier,
                                    cpf: e.target.value,
                                })
                            }
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Razão Social'
                        size='small'
                        fullWidth
                        required
                        value={supplier.name || ''}
                        onChange={(e) =>
                            setSupplier({ ...supplier, name: e.target.value })
                        }
                    />
                </Grid>
                {typeEntity === 'legal' && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            label='Nome Fantasia'
                            size='small'
                            fullWidth
                            value={supplier.fantasyName || ''}
                            onChange={(e) =>
                                setSupplier({
                                    ...supplier,
                                    fantasyName: e.target.value,
                                })
                            }
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Email'
                        size='small'
                        fullWidth
                        value={supplier.email || ''}
                        onChange={(e) =>
                            setSupplier({ ...supplier, email: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Telefone'
                        size='small'
                        fullWidth
                        required
                        value={supplier.phone || ''}
                        onChange={(e) =>
                            setSupplier({ ...supplier, phone: e.target.value })
                        }
                    />
                </Grid>
            </Grid>
            <Box className='mb-3' />
            <Address
                onChange={(v) => setSupplier({ ...supplier, address: v })}
            />
            <Box className='mb-3' />
            <DirectContact
                onChange={(v) => setSupplier({ ...supplier, directContact: v })}
            />
            <Box className='mb-3' />
            <Button variant='contained' onClick={handleSave}>
                <SaveRounded className='me-1' /> Salvar
            </Button>
        </React.Fragment>
    )
}
