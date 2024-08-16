import { PersonAddRounded } from '@mui/icons-material'
import {
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AlertContext } from '../../../contexts/AlertContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import useUtils from '../../../hooks/useUtils'
import { Client, Partner, Supplier, User } from '../../../types/EntityTypes'
import PageHeader from '../../template/PageHeader/PageHeader'
import ClientData from './EntityTypes.tsx/ClientData'
import PartnerData from './EntityTypes.tsx/PartnerData'
import SupplierData from './EntityTypes.tsx/SupplierData'
import UserData from './EntityTypes.tsx/UserData'

type EntityTypes = 'user' | 'client' | 'supplier' | 'partner'

export default function CreateEntity({
    entity,
}: {
    entity?: User | Client | Supplier | Partner
}) {
    const [typeEntity, setTypeEntity] = useState<EntityTypes>('user')
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    const saveEntity = (
        type: EntityTypes,
        data: User | Client | Supplier | Partner
    ) => {
        try {
            const response = axios.post(`${baseURL}/doc?user=${user.id}`, {
                path: type + 's',
                data,
            })

            showAlert({
                message: 'Entidade salva com sucesso',
                type: 'success',
            })
        } catch (error) {
            console.log(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        }
    }

    const createUser = async (userData: User) => {
        try {
            const response = await axios.post(
                `${baseURL}/users?user=${user.id}`,
                {
                    path: 'users',
                    data: userData,
                }
            )

            showAlert({
                message: 'Usuário criado com sucesso',
                type: 'success',
            })
        } catch (error) {
            console.log(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        }
    }

    return (
        <React.Fragment>
            <PageHeader
                title='Cadastro de entidade'
                icon={<PersonAddRounded />}
                path={['dashboard', 'create-entity']}
            />
            <Card>
                <CardContent>
                    <RadioGroup
                        row
                        sx={{
                            justifyContent: 'space-between',
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                        value={typeEntity}
                        onChange={(e) => {
                            const value: EntityTypes = e.target
                                .value as EntityTypes
                            setTypeEntity(value)
                        }}
                        className='mb-3'
                    >
                        <FormControlLabel
                            value='user'
                            control={<Radio />}
                            label='Usuário'
                        />
                        <FormControlLabel
                            value='client'
                            control={<Radio />}
                            label='Cliente'
                        />
                        <FormControlLabel
                            value='supplier'
                            control={<Radio />}
                            label='Fornecedor'
                        />
                        <FormControlLabel
                            value='partner'
                            control={<Radio />}
                            label='Parceiro'
                        />
                    </RadioGroup>
                    {typeEntity === 'user' && (
                        <UserData onSave={(user: User) => createUser(user)} />
                    )}
                    {typeEntity === 'client' && (
                        <ClientData
                            onSave={(client: Client) =>
                                saveEntity(typeEntity, client)
                            }
                        />
                    )}
                    {typeEntity === 'supplier' && (
                        <SupplierData
                            onSave={(supplier: Supplier) =>
                                saveEntity(typeEntity, supplier)
                            }
                        />
                    )}
                    {typeEntity === 'partner' && (
                        <PartnerData
                            onSave={(partner: Partner) =>
                                saveEntity(typeEntity, partner)
                            }
                        />
                    )}
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
