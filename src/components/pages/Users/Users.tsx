import {
    DeleteRounded,
    EditRounded,
    MoreVertRounded,
    PeopleAlt,
} from '@mui/icons-material'
import { Button } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../contexts/AlertContext'
import { SearchContext } from '../../../contexts/SearchContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import { useConfirm } from '../../../hooks/useConfirm'
import useUtils from '../../../hooks/useUtils'
import { EntityTypes, User } from '../../../types/EntityTypes'
import Confirm from '../../template/Confirm/Confirm'
import DynamicTable from '../../template/DynamicTable/DynamicTable'
import Loading from '../../template/Loading/Loading'
import PageHeader from '../../template/PageHeader/PageHeader'
import SimpleMenu from '../../template/SimpleMenu/SimpleMenu'

export default function Users() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { search } = useContext(SearchContext)
    const { showConfirm, confirmState } = useConfirm()
    const navigate = useNavigate()

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseURL}/docs`, {
                params: {
                    user: user.id,
                    path: 'users',
                },
            })

            setUsers(response.data)
        } catch (error: any) {
            console.error(error)
            const code =
                error?.response?.data?.code || error.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || error.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const editClient = (row: any, entityType: EntityTypes) => {
        navigate('/dashboard/create-entity', {
            state: { entity: row, entityType },
        })
    }

    const deleteClient = (id: string) => {
        if (!id) {
            showAlert({
                message: 'Erro ao excluir usuário',
                type: 'error',
            })
            return
        }
        showConfirm({
            title: 'Excluir usuário',
            message: 'Tem certeza que deseja excluir este usuário?',
            onConfirm: async () => {
                try {
                    await axios.delete(`${baseURL}/doc?user=${user.id}`, {
                        params: {
                            path: 'users',
                            id: id,
                        },
                    })

                    showAlert({
                        message: 'Usuário excluído',
                        type: 'success',
                    })

                    setLoading(true)
                    await fetchUsers()
                    setLoading(false)
                } catch (error) {
                    console.log(error)
                    const err: any = error
                    const code =
                        err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                    const message =
                        backendErros(code) || err.message || 'Erro inesperado'
                    showAlert({ message, type: 'error' })
                }
            },
            onCancel: () => {},
        })
    }

    const fieldLabels = {
        id: 'ID',
        'address.reference': 'Referência do Endereço',
        'address.number': 'Número',
        'address.uf': 'UF',
        'address.road': 'Rua',
        'address.city': 'Cidade',
        'address.neighborhood': 'Bairro',
        'address.cep': 'CEP',
        user_type: 'Tipo de Entidade',
        phone: 'Telefone',
        name: 'Nome',
        email: 'Email',
    }

    const defaultVisibleFields = ['name', 'phone', 'email', 'address.cep']

    const customColumns = [
        {
            title: 'Ações',
            render: (row: any) => (
                <SimpleMenu
                    trigger={
                        <Button
                            size='small'
                            variant='contained'
                            sx={{
                                minWidth: 0,
                            }}
                        >
                            <MoreVertRounded fontSize='small' />
                        </Button>
                    }
                    items={[
                        {
                            icon: <EditRounded />,
                            label: 'Editar',
                            onClick: () => editClient(row, 'user'),
                        },
                        {
                            icon: <DeleteRounded />,
                            label: 'Excluir',
                            onClick: () => deleteClient(row.id),
                        },
                    ]}
                />
            ),
        },
    ]

    useEffect(() => {
        fetchUsers()
    }, [])

    if (loading) return <Loading message='Procurando dados dos usuários...' />

    const visibleFields = defaultVisibleFields.filter((field) =>
        users.some(
            (user: User) =>
                field
                    .split('.')
                    .reduce(
                        (o, key) =>
                            o && typeof o === 'object'
                                ? o[key as keyof typeof o]
                                : '',
                        user as any
                    ) !== ''
        )
    )

    return (
        <React.Fragment>
            <PageHeader
                title='Users'
                icon={<PeopleAlt />}
                path={['dashboard', 'users']}
            />
            {users && users.length > 0 && (
                <DynamicTable
                    tableID='users-table'
                    data={users}
                    defaultVisibleFields={visibleFields}
                    fieldLabels={fieldLabels}
                    filterText={search}
                    customColumns={customColumns}
                />
            )}
            <Outlet />
            <Confirm
                open={!!confirmState.title}
                onClose={() =>
                    showConfirm({ ...confirmState, title: '', message: '' })
                }
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm ?? (() => {})}
                onCancel={confirmState.onCancel}
            />
        </React.Fragment>
    )
}
