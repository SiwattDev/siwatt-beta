import { PersonAddRounded } from '@mui/icons-material'
import {
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

export default function CreateEntity() {
    const { state } = useLocation()
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    const entity = state?.entity as User | Client | Supplier | Partner
    const entityType = state?.entityType as EntityTypes

    const [typeEntity, setTypeEntity] = useState<EntityTypes>(
        entityType || 'user'
    )

    useEffect(() => {
        if (entityType) {
            setTypeEntity(entityType)
        }
    }, [entityType])

    const saveEntity = async (
        type: EntityTypes,
        data: User | Client | Supplier | Partner
    ) => {
        try {
            if (data.id) {
                console.log(data)
                await axios.put(`${baseURL}/doc?user=${user.id}`, {
                    path: type + 's',
                    id: data.id,
                    data,
                })
                showAlert({
                    message: 'Entidade atualizada com sucesso',
                    type: 'success',
                })
            } else {
                await axios.post(`${baseURL}/doc?user=${user.id}`, {
                    path: type + 's',
                    data,
                })
                showAlert({
                    message: 'Entidade criada com sucesso',
                    type: 'success',
                })
            }
        } catch (error) {
            console.error(error)
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
            if (userData.id) {
                console.log(userData)
                await axios.put(`${baseURL}/users?user=${user.id}`, {
                    uid: userData.id,
                    data: userData,
                })

                showAlert({
                    message: 'Usuário atualizado com sucesso',
                    type: 'success',
                })

                return
            }

            await axios.post(`${baseURL}/users?user=${user.id}`, {
                path: 'users',
                data: userData,
            })

            showAlert({
                message: 'Usuário criado com sucesso',
                type: 'success',
            })
        } catch (error) {
            console.error(error)
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
                        onChange={(e) =>
                            setTypeEntity(e.target.value as EntityTypes)
                        }
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
                        <UserData
                            onSave={(user: User) => createUser(user)}
                            data={entity as User}
                        />
                    )}
                    {typeEntity === 'client' && (
                        <ClientData
                            onSave={(client: Client) =>
                                saveEntity(typeEntity, client)
                            }
                            data={entity as Client}
                        />
                    )}
                    {typeEntity === 'supplier' && (
                        <SupplierData
                            onSave={(supplier: Supplier) =>
                                saveEntity(typeEntity, supplier)
                            }
                            data={entity as Supplier}
                        />
                    )}
                    {typeEntity === 'partner' && (
                        <PartnerData
                            onSave={(partner: Partner) =>
                                saveEntity(typeEntity, partner)
                            }
                            data={entity as Partner}
                        />
                    )}
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
